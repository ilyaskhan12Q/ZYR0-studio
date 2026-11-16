'use client';

import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  collapsed: boolean;
  pinned: boolean;
  isMobile: boolean;
  isServerMode: boolean;
  version: string;
  onBrandClick: () => void;
  onTogglePinned: () => void;
}

/**
 * Logo mark, wordmark, and the explicit collapse control.
 *
 * Collapsing used to be discoverable only by hovering the logo and noticing that it turned into a
 * chevron. It now has a dedicated button on the right of the header; the hover-to-expand behaviour
 * on an unpinned sidebar is unchanged.
 */
export function BrandHeader({
  collapsed,
  pinned,
  isMobile,
  isServerMode,
  version,
  onBrandClick,
  onTogglePinned,
}: BrandHeaderProps) {
  return (
    <div className="flex h-[58px] shrink-0 items-center gap-2 border-b border-zyr0-hairline px-3">
      <button
        type="button"
        onClick={onBrandClick}
        title={collapsed ? 'Expand sidebar' : 'ZYR0 Studio home'}
        className={cn(
          'flex min-w-0 items-center gap-2.5 rounded-lg py-1 transition-opacity hover:opacity-80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyr0-blue/60',
          collapsed && 'mx-auto justify-center'
        )}
      >
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-zyr0-blue/25 blur-md" />
          <Logo width={24} height={24} className="relative" />
        </span>
        {!collapsed && (
          <span className="flex min-w-0 flex-col items-start text-left">
            <span className="truncate text-[13px] font-semibold leading-none tracking-tight text-zyr0-text">
              ZYR0-Studio
            </span>
            <span className="mt-1 truncate text-[10px] leading-none text-zyr0-text-faint">
              {isServerMode ? `Server · v${version}` : `v${version}`}
            </span>
          </span>
        )}
      </button>

      {!collapsed && !isMobile && (
        <button
          type="button"
          onClick={onTogglePinned}
          title={pinned ? 'Collapse sidebar' : 'Pin sidebar'}
          aria-label={pinned ? 'Collapse sidebar' : 'Pin sidebar'}
          className="ml-auto shrink-0 rounded-md p-1.5 text-zyr0-text-faint transition-colors hover:bg-white/5 hover:text-zyr0-text"
        >
          {pinned ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
