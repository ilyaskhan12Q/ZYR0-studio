'use client';

import React from 'react';
import { FolderOpen, LayoutTemplate } from 'lucide-react';
import { formatRelativeTime } from './utils';
import type { GalleryProject, GalleryTemplate } from './types';

interface GalleryCardProps {
  project: GalleryProject;
  onSelect: (projectId: string) => void;
}

/**
 * Gallery tile for a project.
 *
 * Deliberately not `ProjectCard`: that component fetches per-project stats and carries inline
 * rename plus a nine-item menu, which is the wrong weight for a four-up gallery and would fire one
 * query per tile.
 */
export function GalleryCard({ project, onSelect }: GalleryCardProps) {
  return (
    <button
      type="button"
      data-tour-id="project-card"
      onClick={() => onSelect(project.id)}
      title={project.description || project.name}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zyr0-hairline bg-white/[0.02] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyr0-blue/60"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zyr0-elevated">
        {project.previewImage ? (
          <img
            src={project.previewImage}
            alt={`${project.name} preview`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zyr0-blue/20 via-zyr0-violet/10 to-zyr0-gold/10" />
            <div className="zyr0-mesh zyr0-mesh-blue left-[10%] top-[6%] h-28 w-28 opacity-70" />
            <FolderOpen className="relative h-6 w-6 text-white/30" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="min-w-0 p-3">
        <p className="truncate text-[13px] font-medium text-zyr0-text">{project.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-zyr0-text-faint">
          {formatRelativeTime(project.updatedAt)}
        </p>
      </div>
    </button>
  );
}

interface TemplateCardProps {
  template: GalleryTemplate;
  onSelect: () => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={template.description || template.name}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zyr0-hairline bg-white/[0.02] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-xl hover:shadow-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyr0-blue/60"
    >
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zyr0-violet/25 via-transparent to-zyr0-gold/15" />
        <div className="zyr0-mesh zyr0-mesh-violet left-[20%] top-[10%] h-24 w-24 opacity-60" />
        <LayoutTemplate className="relative h-6 w-6 text-white/30" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 p-3">
        <p className="truncate text-[13px] font-medium text-zyr0-text">{template.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-zyr0-text-faint">
          {template.isBuiltIn ? 'Built-in template' : 'Custom template'}
        </p>
      </div>
    </button>
  );
}
