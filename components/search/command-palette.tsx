'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CornerDownLeft,
  FileText,
  FolderOpen,
  LayoutTemplate,
  Plus,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { vfs } from '@/lib/vfs';
import { templateService } from '@/lib/vfs/template-service';
import { skillsService } from '@/lib/vfs/skills';
import { BUILT_IN_TEMPLATES } from '@/lib/vfs/templates';
import { DOCS_ITEMS } from '@/lib/constants/docs';
import type { Project } from '@/lib/vfs/types';

type GroupId = 'actions' | 'projects' | 'templates' | 'skills' | 'docs';

interface CommandEntry {
  id: string;
  group: GroupId;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  keywords?: string;
  run: () => void;
}

const GROUP_LABELS: Record<GroupId, string> = {
  actions: 'Actions',
  projects: 'Projects',
  templates: 'Templates',
  skills: 'Skills',
  docs: 'Docs',
};

const GROUP_ORDER: GroupId[] = ['actions', 'projects', 'templates', 'skills', 'docs'];

interface CommandPaletteProps {
  onProjectSelect: (project: Project) => void;
  onNavigate?: (view: string) => void;
  workspaceId?: string;
}

/**
 * ⌘K / Ctrl+K overlay across projects, templates, skills and docs.
 *
 * Opened by the sidebar's Search item (which dispatches `zyr0:open-search`) or by the shortcut.
 * Data is read on first open rather than on mount so the dashboard's own queries stay the only
 * ones issued on a cold start.
 */
export function CommandPalette({ onProjectSelect, onNavigate, workspaceId }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [skills, setSkills] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isServerMode = process.env.NEXT_PUBLIC_SERVER_MODE === 'true';

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  // Global shortcut + sidebar event
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        return;
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpenSearch = () => setOpen(true);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('zyr0:open-search', onOpenSearch as EventListener);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('zyr0:open-search', onOpenSearch as EventListener);
    };
  }, []);

  // Load the search corpus on first open
  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;

    (async () => {
      try {
        await vfs.init();
        const projectList = await vfs.listProjects();
        const customTemplates = await templateService.listCustomTemplates();
        const skillList = await skillsService.getAllSkills();
        if (cancelled) return;

        setProjects(projectList.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
        setTemplates([
          ...BUILT_IN_TEMPLATES.map(t => ({ id: t.id, name: t.name, description: t.description })),
          ...customTemplates.map(t => ({ id: t.id, name: t.name })),
        ]);
        setSkills(skillList.map(s => ({ id: s.id, name: s.name, description: s.description })));
      } catch {
        // A failed load just leaves the palette with actions and docs.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => { cancelled = true; };
  }, [open, loaded]);

  // Focus the input whenever the palette opens
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const navigateToDoc = useCallback((docId: string) => {
    if (isServerMode) {
      const base = workspaceId ? `/w/${workspaceId}` : '/admin';
      router.push(`${base}/docs?doc=${docId}`);
    } else {
      router.push(`/?doc=${docId}`);
      onNavigate?.('docs');
    }
  }, [isServerMode, workspaceId, router, onNavigate]);

  const entries = useMemo<CommandEntry[]>(() => {
    const list: CommandEntry[] = [
      {
        id: 'action:new-project',
        group: 'actions',
        title: 'New project',
        subtitle: 'Start from a template or a prompt',
        icon: Plus,
        keywords: 'create new blank',
        run: () => onNavigate?.('projects:create'),
      },
      {
        id: 'action:settings',
        group: 'actions',
        title: 'Open settings',
        subtitle: 'Application, provider and model',
        icon: Settings,
        keywords: 'preferences config model provider',
        run: () => onNavigate?.('settings'),
      },
    ];

    for (const project of projects) {
      list.push({
        id: `project:${project.id}`,
        group: 'projects',
        title: project.name,
        subtitle: project.description || undefined,
        icon: FolderOpen,
        keywords: project.description,
        run: () => onProjectSelect(project),
      });
    }

    for (const template of templates) {
      list.push({
        id: `template:${template.id}`,
        group: 'templates',
        title: template.name,
        subtitle: template.description,
        icon: LayoutTemplate,
        keywords: template.description,
        run: () => onNavigate?.('templates'),
      });
    }

    for (const skill of skills) {
      list.push({
        id: `skill:${skill.id}`,
        group: 'skills',
        title: skill.name,
        subtitle: skill.description,
        icon: Sparkles,
        keywords: skill.description,
        run: () => onNavigate?.('skills'),
      });
    }

    for (const doc of DOCS_ITEMS) {
      list.push({
        id: `doc:${doc.id}`,
        group: 'docs',
        title: doc.title,
        icon: FileText,
        keywords: doc.file,
        run: () => navigateToDoc(doc.id),
      });
    }

    return list;
  }, [projects, templates, skills, onNavigate, onProjectSelect, navigateToDoc]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const haystack = `${entry.title} ${entry.subtitle ?? ''} ${entry.keywords ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query]);

  // Flat list for keyboard navigation, grouped for display
  const flat = useMemo(() => {
    const byGroup = new Map<GroupId, CommandEntry[]>();
    for (const entry of results) {
      const bucket = byGroup.get(entry.group) ?? [];
      if (bucket.length < 6) bucket.push(entry);
      byGroup.set(entry.group, bucket);
    }
    return GROUP_ORDER.flatMap(g => byGroup.get(g) ?? []);
  }, [results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the highlighted row in view
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const runEntry = useCallback((entry: CommandEntry | undefined) => {
    if (!entry) return;
    close();
    // Defer so the overlay unmounts before navigation changes the view.
    requestAnimationFrame(() => entry.run());
  }, [close]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (flat.length === 0 ? 0 : (i + 1) % flat.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (flat.length === 0 ? 0 : (i - 1 + flat.length) % flat.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runEntry(flat[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search ZYR0 Studio"
        className="zyr0-surface relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zyr0-hairline-strong bg-zyr0-panel/95 shadow-2xl shadow-black/70 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-zyr0-hairline px-4">
          <Search className="h-4 w-4 shrink-0 text-zyr0-text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, templates, skills, docs…"
            className="h-12 w-full bg-transparent text-sm text-zyr0-text outline-none placeholder:text-zyr0-text-faint"
            aria-autocomplete="list"
            aria-controls="zyr0-command-results"
          />
          <kbd className="hidden shrink-0 rounded border border-zyr0-hairline px-1.5 py-0.5 text-[10px] text-zyr0-text-faint sm:block">
            ESC
          </kbd>
        </div>

        <div id="zyr0-command-results" ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-zyr0-text-faint">
              {loaded ? 'No matches' : 'Searching…'}
            </p>
          ) : (
            GROUP_ORDER.map((group) => {
              const items = flat.filter(entry => entry.group === group);
              if (items.length === 0) return null;

              return (
                <div key={group} className="mb-1">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zyr0-text-faint">
                    {GROUP_LABELS[group]}
                  </div>
                  {items.map((entry) => {
                    const index = flat.indexOf(entry);
                    const isActive = index === activeIndex;
                    const Icon = entry.icon;

                    return (
                      <button
                        key={entry.id}
                        type="button"
                        data-active={isActive}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => runEntry(entry)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                          isActive ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-zyr0-text-faint" strokeWidth={1.75} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-zyr0-text">{entry.title}</span>
                          {entry.subtitle && (
                            <span className="block truncate text-[11px] text-zyr0-text-faint">
                              {entry.subtitle}
                            </span>
                          )}
                        </span>
                        {isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-zyr0-text-faint" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zyr0-hairline px-4 py-2 text-[10px] text-zyr0-text-faint">
          <span className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
          </span>
          <span>{flat.length} results</span>
        </div>
      </div>
    </div>
  );
}
