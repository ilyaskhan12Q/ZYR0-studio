'use client';

import React from 'react';
import { ChevronRight, FolderOpen } from 'lucide-react';
import type { QuickProject } from './types';

interface ProjectsQuicklistProps {
  projects: QuickProject[];
  loading: boolean;
  collapsed: boolean;
  onSelect: (projectId: string) => void;
  onViewAll: () => void;
}

/**
 * Dedicated recent-projects block.
 *
 * Previously these lived *inside* the Projects nav item as an expandable list, which meant the
 * only way to reach a recent project was to expand the nav entry — and the list had no entry
 * point to the full gallery.
 */
export function ProjectsQuicklist({
  projects,
  loading,
  collapsed,
  onSelect,
  onViewAll,
}: ProjectsQuicklistProps) {
  if (collapsed) return null;

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between px-3 pb-1">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zyr0-text-faint">
          Recent
        </span>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[10px] text-zyr0-text-faint transition-colors hover:text-zyr0-text"
        >
          View all
        </button>
      </div>

      {loading ? (
        <div className="space-y-1 px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-7 items-center gap-2 px-2">
              <div className="h-3 w-3 animate-pulse rounded bg-white/10" />
              <div className="h-2.5 flex-1 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="px-3 py-1.5 text-[11px] text-zyr0-text-faint">No projects yet</p>
      ) : (
        <div className="space-y-0.5 px-2">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelect(project.id)}
              title={project.name}
              className="group flex h-7 w-full items-center gap-2 rounded-lg px-2 text-left text-xs text-zyr0-text-dim transition-colors hover:bg-white/[0.045] hover:text-zyr0-text"
            >
              <FolderOpen className="h-3.5 w-3.5 shrink-0 text-zyr0-text-faint group-hover:text-zyr0-text-dim" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 truncate">{project.name}</span>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
