'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SidebarItem } from './types';

interface NavItemProps {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
  expanded?: boolean;
  hasChildren?: boolean;
  badge?: number | null;
  onSelect: () => void;
  onToggleExpand?: () => void;
}

/**
 * One primary navigation row.
 *
 * Active state is a filled pill plus a 2px rail, and it applies to items with sub-items too —
 * the previous implementation skipped them, so Projects/Docs/Settings never showed as selected
 * unless their child was.
 */
export function NavItem({
  item,
  active,
  collapsed,
  expanded = false,
  hasChildren = false,
  badge = null,
  onSelect,
  onToggleExpand,
}: NavItemProps) {
  const Icon = item.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        title={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'group relative flex h-9 w-full items-center rounded-xl text-[13px] transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyr0-blue/60',
          collapsed ? 'justify-center px-0' : 'gap-3 px-3',
          !collapsed && hasChildren && 'pr-9',
          active
            ? 'bg-white/[0.075] font-medium text-zyr0-text'
            : 'text-zyr0-text-dim hover:bg-white/[0.045] hover:text-zyr0-text'
        )}
      >
        <span
          className={cn(
            'absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-zyr0-blue transition-opacity',
            active ? 'opacity-100' : 'opacity-0'
          )}
        />
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            active ? 'text-zyr0-text' : 'text-zyr0-text-faint group-hover:text-zyr0-text-dim'
          )}
          strokeWidth={1.75}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && badge !== null && badge > 0 && (
          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-zyr0-blue/20 px-1 text-[10px] font-medium tabular-nums text-zyr0-blue">
            {badge}
          </span>
        )}
      </button>

      {!collapsed && hasChildren && (
        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
          aria-expanded={expanded}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zyr0-text-faint transition-colors hover:bg-white/5 hover:text-zyr0-text"
        >
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
        </button>
      )}
    </div>
  );
}

interface SubNavItemProps {
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export function SubNavItem({ label, icon: Icon, active, collapsed, onClick }: SubNavItemProps) {
  if (collapsed) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      title={label}
      className={cn(
        'relative flex h-7 w-full items-center gap-2 rounded-lg pl-8 pr-2 text-xs transition-colors',
        active
          ? 'text-zyr0-text'
          : 'text-zyr0-text-faint hover:bg-white/[0.04] hover:text-zyr0-text-dim'
      )}
    >
      {/* Guide line so nested items read as children rather than siblings. */}
      <span className="pointer-events-none absolute bottom-1.5 left-[18px] top-1.5 w-px bg-zyr0-hairline" />
      <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} />
      <span className="truncate">{label}</span>
    </button>
  );
}
