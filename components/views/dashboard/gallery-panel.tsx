'use client';

import React, { useMemo, useState } from 'react';
import { FolderOpen, LayoutTemplate, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GalleryCard, TemplateCard } from './gallery-card';
import type { GalleryProject, GalleryTab, GalleryTemplate } from './types';

interface GalleryPanelProps {
  projects: GalleryProject[];
  recentProjects: GalleryProject[];
  templates: GalleryTemplate[];
  onProjectSelect: (projectId: string) => void;
  onViewAllProjects: () => void;
  onBrowseTemplates: () => void;
  onNewProject: () => void;
}

const TABS: Array<{ id: GalleryTab; label: string }> = [
  { id: 'search', label: 'Search' },
  { id: 'projects', label: 'My projects' },
  { id: 'recent', label: 'Recently viewed' },
  { id: 'templates', label: 'Templates' },
];

const GRID = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export function GalleryPanel({
  projects,
  recentProjects,
  templates,
  onProjectSelect,
  onViewAllProjects,
  onBrowseTemplates,
  onNewProject,
}: GalleryPanelProps) {
  const [tab, setTab] = useState<GalleryTab>('projects');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const filteredProjects = useMemo(
    () => (q ? projects.filter(p => `${p.name} ${p.description ?? ''}`.toLowerCase().includes(q)) : projects),
    [projects, q]
  );

  const filteredRecent = useMemo(
    () => (q ? recentProjects.filter(p => `${p.name} ${p.description ?? ''}`.toLowerCase().includes(q)) : recentProjects),
    [recentProjects, q]
  );

  const filteredTemplates = useMemo(
    () => (q ? templates.filter(t => `${t.name} ${t.description ?? ''}`.toLowerCase().includes(q)) : templates),
    [templates, q]
  );

  const body = () => {
    if (tab === 'templates') {
      return filteredTemplates.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title={q ? `No templates match “${query}”` : 'No templates yet'}
          hint="Built-in templates appear here as soon as the template list loads."
          action={{ label: 'Browse templates', onClick: onBrowseTemplates }}
        />
      ) : (
        <div className={GRID}>
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={onBrowseTemplates} />
          ))}
        </div>
      );
    }

    if (tab === 'recent') {
      return filteredRecent.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={q ? `Nothing recently viewed matches “${query}”` : 'Nothing viewed recently'}
          hint="Projects you open show up here, most recent first."
        />
      ) : (
        <div className={GRID}>
          {filteredRecent.map(project => (
            <GalleryCard key={project.id} project={project} onSelect={onProjectSelect} />
          ))}
        </div>
      );
    }

    // 'projects' and 'search' both show projects; 'search' additionally lists matching templates.
    const searchTemplates = tab === 'search' ? filteredTemplates.slice(0, 4) : [];

    if (filteredProjects.length === 0 && searchTemplates.length === 0) {
      return (
        <EmptyState
          icon={Sparkles}
          title={q ? `No matches for “${query}”` : 'No projects yet'}
          hint={
            q
              ? 'Try a different name, or clear the search.'
              : 'Describe what you want above and ZYR0 Studio will scaffold it as a project.'
          }
          action={q ? undefined : { label: 'New project', onClick: onNewProject }}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className={GRID}>
          {filteredProjects.slice(0, 8).map(project => (
            <GalleryCard key={project.id} project={project} onSelect={onProjectSelect} />
          ))}
        </div>

        {searchTemplates.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.14em] text-zyr0-text-faint">
                Templates
              </h3>
              <button
                type="button"
                onClick={onBrowseTemplates}
                className="text-[10px] text-zyr0-text-faint transition-colors hover:text-zyr0-text"
              >
                Browse all
              </button>
            </div>
            <div className={GRID}>
              {searchTemplates.map(template => (
                <TemplateCard key={template.id} template={template} onSelect={onBrowseTemplates} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const activeCount = tab === 'templates'
    ? filteredTemplates.length
    : tab === 'recent'
      ? filteredRecent.length
      : filteredProjects.length;

  return (
    <div className="relative z-10 -mt-24 rounded-t-[28px] border-t border-zyr0-hairline bg-zyr0-panel px-4 pb-12 pt-5 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.9)] sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Project gallery"
            className="flex flex-wrap gap-1 rounded-xl border border-zyr0-hairline bg-white/[0.02] p-1"
          >
            {TABS.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors',
                  tab === item.id
                    ? 'bg-white/[0.08] text-zyr0-text'
                    : 'text-zyr0-text-faint hover:bg-white/[0.04] hover:text-zyr0-text-dim'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zyr0-text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects and templates…"
                aria-label="Search projects and templates"
                className="h-8 w-full rounded-lg border border-zyr0-hairline bg-white/[0.03] pl-8 pr-2 text-[11px] text-zyr0-text outline-none transition-colors placeholder:text-zyr0-text-faint focus:border-white/20 focus:bg-white/[0.05]"
              />
            </div>
            <button
              type="button"
              onClick={onViewAllProjects}
              className="shrink-0 rounded-lg border border-zyr0-hairline px-2.5 py-1.5 text-[11px] text-zyr0-text-dim transition-colors hover:border-white/20 hover:text-zyr0-text"
            >
              View all
            </button>
          </div>
        </div>

        <div className="mb-3 mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-zyr0-text-faint">
          <span>{activeCount} {activeCount === 1 ? 'item' : 'items'}</span>
        </div>

        {body()}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: React.ElementType;
  title: string;
  hint: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zyr0-hairline px-6 py-14 text-center">
      <div className="relative mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04]">
        <Icon className="h-5 w-5 text-zyr0-text-faint" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-zyr0-text">{title}</p>
      <p className="mt-1 max-w-sm text-[11px] text-zyr0-text-faint">{hint}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-zyr0-blue px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-blue-500"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
