'use client';

import React from 'react';
import { LogOut, Settings } from 'lucide-react';
import { CreditsMeter } from '@/components/ui/credits-meter';

interface UserCardProps {
  collapsed: boolean;
  name: string;
  plan?: string;
  creditsUsed: number;
  creditsTotal: number;
  onSettings?: () => void;
  onLogout?: () => void;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserCard({
  collapsed,
  name,
  plan = 'Free plan',
  creditsUsed,
  creditsTotal,
  onSettings,
  onLogout,
}: UserCardProps) {
  const initials = initialsOf(name);

  if (collapsed) {
    return (
      <div className="shrink-0 border-t border-zyr0-hairline p-2">
        <button
          type="button"
          onClick={onSettings}
          title={name}
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zyr0-blue to-zyr0-violet text-[10px] font-semibold text-white ring-2 ring-white/10 transition-transform hover:scale-105"
        >
          {initials}
        </button>
      </div>
    );
  }

  return (
    <div className="shrink-0 border-t border-zyr0-hairline p-2">
      <div className="rounded-xl border border-zyr0-hairline bg-white/[0.03] p-2.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zyr0-blue to-zyr0-violet text-[10px] font-semibold text-white ring-2 ring-white/10">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zyr0-panel bg-emerald-500" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-zyr0-text">{name}</span>
            <span className="block truncate text-[10px] text-zyr0-text-faint">{plan}</span>
          </span>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              aria-label="Log out"
              className="shrink-0 rounded-md p-1 text-zyr0-text-faint transition-colors hover:bg-white/5 hover:text-zyr0-text"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSettings}
              title="Settings"
              aria-label="Settings"
              className="shrink-0 rounded-md p-1 text-zyr0-text-faint transition-colors hover:bg-white/5 hover:text-zyr0-text"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <CreditsMeter used={creditsUsed} total={creditsTotal} className="mt-2.5" />
      </div>
    </div>
  );
}
