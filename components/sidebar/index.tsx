'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Project } from '@/lib/vfs/types';
import { vfs } from '@/lib/vfs';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  Cloud,
  FolderOpen,
  Github,
  Globe,
  Info,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Search,
  Settings,
  Sparkles,
  TestTube,
  UserCircle,
  Users,
} from 'lucide-react';
import { DOCS_ITEMS } from '@/lib/constants/docs';
import { cn } from '@/lib/utils';
import { useProjectSyncState } from '@/lib/hooks/use-project-sync-state';
import pkg from '@/package.json';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { BrandHeader } from './brand-header';
import { NavItem, SubNavItem } from './nav-item';
import { ProjectsQuicklist } from './projects-quicklist';
import { UserCard } from './user-card';
import type { SidebarItem } from './types';

// Collapsed sidebar width
export const COLLAPSED_SIDEBAR_WIDTH = 56; // Width in pixels for icon-only buttons

/** Placeholder identity/credit values until a real account + billing source exists. */
const PLACEHOLDER_USER_NAME = 'Ilyas';
const PLACEHOLDER_CREDITS_USED = 2400;
const PLACEHOLDER_CREDITS_TOTAL = 5000;

const SETTINGS_SUB_ITEMS: SidebarItem['subItems'] = [
  { id: 'application', label: 'Application', icon: Settings },
  { id: 'model', label: 'Provider & Model', icon: Sparkles },
];

/**
 * Primary navigation. `Search` is an action, not a view: it opens the command palette.
 * Item ids are stable — only labels changed (Dashboard → Home) so routing, the guided tour and
 * deep links keep working.
 */
const PRIMARY_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: 'dashboard' },
  { id: 'search', label: 'Search', icon: Search, action: 'search' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, path: 'projects' },
  { id: 'skills', label: 'Skills', icon: Sparkles, path: 'skills' },
  { id: 'settings', label: 'Settings', icon: Settings, path: 'settings', subItems: SETTINGS_SUB_ITEMS },
];

/** Everything else, behind the "More" disclosure. */
const SECONDARY_ITEMS: SidebarItem[] = [
  { id: 'deployments', label: 'Deployments', icon: Globe, path: 'deployments', serverModeOnly: true },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, path: 'templates' },
  { id: 'interviews', label: 'Interviews', icon: ClipboardList, path: 'interviews' },
  { id: 'users', label: 'Users', icon: Users, path: 'users', serverModeOnly: true, adminOnly: true, managedOnly: true },
  {
    id: 'docs',
    label: 'Docs',
    icon: BookOpen,
    path: 'docs',
    subItems: DOCS_ITEMS.map((doc) => ({
      id: doc.id,
      label: doc.title,
      icon: doc.icon,
      file: doc.file,
    })),
  },
  { id: 'tour', label: 'Guided Tour', icon: Info, action: 'start-tour' },
  { id: 'tester', label: 'Benchmark', icon: TestTube, path: '/test-generation' },
  { id: 'about', label: 'About', icon: Info, action: 'open-about' },
  { id: 'github', label: 'GitHub', icon: Github, href: 'https://github.com/ilyaskhan/zyr0-studio' },
];

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

const SYSTEM_ACTIONS: SidebarItem[] = [
  { id: 'sync', label: 'Server Sync', icon: Cloud, action: 'server-sync' },
  ...(GATEWAY_URL ? [{ id: 'account', label: 'Account', icon: UserCircle, href: `${GATEWAY_URL}/account` }] : []),
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
];

interface SidebarProps {
  currentView: string;
  workspaceId?: string;
  onNavigate: (view: string) => void;
  onProjectSelect: (project: Project) => void;
  onStartTour?: () => void;
  onOpenAbout?: () => void;
  onOpenSettings?: () => void;
  onServerSync?: () => void;
  onPinnedChange?: (pinned: boolean) => void;
  onHoverChange?: (hovering: boolean) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

function SidebarContent({
  currentView,
  workspaceId,
  onNavigate,
  onProjectSelect,
  onStartTour,
  onOpenAbout,
  onOpenSettings,
  onServerSync,
  onPinnedChange,
  onHoverChange,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
}: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDocId = searchParams.get('doc');
  const currentSettingsTab = searchParams.get('settings');
  const [pinned, setPinned] = useState(true); // Pinned = sidebar stays expanded
  const [hovering, setHovering] = useState(false);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loadingRecentProjects, setLoadingRecentProjects] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userName, setUserName] = useState(PLACEHOLDER_USER_NAME);

  // Initialize expandedItems based on currentView to prevent flash
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentView === 'docs') initial.add('docs');
    if (currentView === 'settings') initial.add('settings');
    return initial;
  });

  const isServerMode = process.env.NEXT_PUBLIC_SERVER_MODE === 'true';
  // Read-only: the gallery owns refreshing this, so the sidebar adds no extra request.
  const { pendingCount } = useProjectSyncState();
  const isDesktop = process.env.NEXT_PUBLIC_DESKTOP === 'true';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isServerMode) return;
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(data => {
      if (data?.user?.isAdmin) setIsAdmin(true);
      const name = data?.user?.name || (data?.user?.email ? String(data.user.email).split('@')[0] : null);
      if (name) setUserName(name);
    }).catch(() => {});
  }, [isServerMode]);

  // Track if we're on mobile (client-side only)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Collapsed state is derived: collapsed when not pinned AND not hovering (desktop only)
  // On mobile, sidebar is never collapsed - it's either open or closed via mobileOpen
  const collapsed = !isMobile && !pinned && !hovering;

  // Auto-expand items when on their view, and reveal "More" when the active view lives inside it.
  useEffect(() => {
    if (currentView === 'docs') {
      setExpandedItems(prev => new Set(prev).add('docs'));
    }
    if (currentView === 'settings') {
      setExpandedItems(prev => new Set(prev).add('settings'));
    }
    if (SECONDARY_ITEMS.some(item => item.id === currentView)) {
      setMoreOpen(true);
    }
  }, [currentView]);

  // Load recent projects
  useEffect(() => {
    async function loadRecentProjects() {
      try {
        await vfs.init();
        const projects = await vfs.listProjects();
        const sorted = projects.sort((a, b) =>
          b.updatedAt.getTime() - a.updatedAt.getTime()
        );
        setRecentProjects(sorted.slice(0, 4));
      } catch (error) {
        console.error('Failed to load recent projects:', error);
      } finally {
        setLoadingRecentProjects(false);
      }
    }
    loadRecentProjects();
  }, []);

  // Load pinned state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('osw-admin-sidebar-pinned');
    if (stored !== null) {
      setPinned(stored === 'true');
    }
  }, []);

  // Toggle pinned state
  const togglePinned = () => {
    const newState = !pinned;
    setPinned(newState);
    localStorage.setItem('osw-admin-sidebar-pinned', String(newState));
    onPinnedChange?.(newState);
  };

  // Mouse enter/leave handlers (desktop only)
  const handleMouseEnter = () => {
    if (!isMobile && !pinned) {
      setHovering(true);
      onHoverChange?.(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !pinned) {
      setHovering(false);
      onHoverChange?.(false);
    }
  };

  // Notify parent of initial pinned state
  useEffect(() => {
    onPinnedChange?.(pinned);
  }, [pinned, onPinnedChange]);

  // Notify parent of collapsed state
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const isManagedMode = !!GATEWAY_URL;

  const isVisible = (item: SidebarItem) =>
    (!item.serverModeOnly || isServerMode) &&
    (!item.adminOnly || isAdmin) &&
    (!item.managedOnly || isManagedMode);

  const visiblePrimaryItems = PRIMARY_ITEMS.filter(isVisible);
  const visibleSecondaryItems = SECONDARY_ITEMS.filter(isVisible);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const navigateToView = (viewId: string, path?: string) => {
    onMobileOpenChange?.(false);

    if (!path) {
      onNavigate(viewId);
      return;
    }

    // Check if path is absolute (starts with /)
    if (path.startsWith('/')) {
      router.push(path);
    } else if (isServerMode) {
      // System-wide items (users, workspaces) always go to /admin/
      const systemItems = ['users', 'workspaces'];
      if (systemItems.includes(viewId)) {
        router.push(`/admin/${path}`);
      } else if (workspaceId) {
        router.push(`/w/${workspaceId}/${path}`);
      } else {
        router.push(`/admin/${path}`);
      }
    } else {
      // Browser Mode: Use router.push to clear query params when navigating away from docs
      router.push('/');
      onNavigate(viewId);
    }
  };

  const handleItemAction = async (item: SidebarItem) => {
    // Close mobile menu when action is triggered
    onMobileOpenChange?.(false);

    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.path) {
      navigateToView(item.id, item.path);
    } else if (item.action === 'search') {
      window.dispatchEvent(new CustomEvent('zyr0:open-search'));
    } else if (item.action === 'start-tour' && onStartTour) {
      onStartTour();
    } else if (item.action === 'open-about' && onOpenAbout) {
      onOpenAbout();
    } else if (item.action === 'open-settings' && onOpenSettings) {
      onOpenSettings();
    } else if (item.action === 'server-sync' && onServerSync) {
      onServerSync();
    } else if (item.action === 'logout') {
      try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        if (response.ok) {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const handleProjectSelect = (projectId: string) => {
    const project = recentProjects.find(p => p.id === projectId);
    onMobileOpenChange?.(false);
    if (project) onProjectSelect(project);
  };

  const renderItem = (item: SidebarItem) => {
    const hasSubItems = !!(item.subItems && item.subItems.length > 0);
    const isExpanded = expandedItems.has(item.id);
    const isActive = currentView === item.id;

    return (
      <div key={item.id}>
        <NavItem
          item={item}
          active={isActive}
          collapsed={collapsed}
          expanded={isExpanded}
          hasChildren={hasSubItems}
          onSelect={() => {
            // For parents with children: clicking the row navigates if that is what the user
            // is not already on, otherwise it toggles the group.
            if (!hasSubItems || !isActive) {
              handleItemAction(item);
            } else {
              toggleExpanded(item.id);
            }
          }}
          onToggleExpand={() => toggleExpanded(item.id)}
        />

        {hasSubItems && isExpanded && (
          <div className="mb-1 mt-0.5 space-y-0.5">
            {item.subItems!.map((subItem) => {
              // For docs, check currentDocId. For settings, check URL param or path
              const wsBase = workspaceId ? `/w/${workspaceId}` : '/admin';
              const isSubItemActive = subItem.file
                ? currentDocId === subItem.id
                : item.id === 'settings'
                  ? currentSettingsTab === subItem.id
                  : (isServerMode && (window.location.pathname === `${wsBase}/${item.id}/${subItem.id}` || window.location.pathname === `/admin/${item.id}/${subItem.id}`));

              return (
                <SubNavItem
                  key={subItem.id}
                  label={subItem.label}
                  icon={subItem.icon}
                  active={isSubItemActive}
                  collapsed={collapsed}
                  onClick={() => {
                    onMobileOpenChange?.(false);
                    if (isServerMode) {
                      const subBase = workspaceId ? `/w/${workspaceId}` : '/admin';
                      if (subItem.file) {
                        // Docs sub-item
                        router.push(`${subBase}/docs?doc=${subItem.id}`);
                      } else {
                        // Settings sub-item — the settings page reads the tab from
                        // ?settings=, there is no /settings/<tab> route (that 404s).
                        router.push(`${subBase}/${item.id}?settings=${subItem.id}`);
                      }
                    } else {
                      // Browser mode
                      if (subItem.file) {
                        // Docs sub-item - navigate to specific doc
                        router.push(`/?doc=${subItem.id}`);
                        onNavigate(item.id);
                      } else if (item.id === 'settings') {
                        // Settings sub-item - use query param
                        router.push(`/?settings=${subItem.id}`);
                        onNavigate(item.id);
                      } else {
                        // Other sub-items
                        router.push('/');
                        onNavigate(item.id);
                      }
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => onMobileOpenChange?.(false)}
        />
      )}

      <div
        className={cn(
          'zyr0-surface flex flex-col h-screen bg-zyr0-obsidian text-zyr0-text transition-all duration-300',
          // Border: left on mobile (slides from right), right on desktop (stays on left)
          'border-l border-zyr0-hairline md:border-l-0 md:border-r',
          // Desktop behavior - always on left
          'md:relative md:left-0',
          pinned ? 'md:relative' : 'md:absolute md:left-0 md:top-0 md:z-40 md:shadow-2xl md:shadow-black/60',
          // Mobile behavior - slide in from right, fixed 240px width
          'fixed right-0 top-0 z-50 w-60',
          // Desktop - 240px when expanded, or collapsed width
          collapsed ? '' : 'md:w-60',
          // Mobile: slide from right. Desktop: always visible
          mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        )}
        style={{
          // Apply collapsed width when needed
          width: collapsed ? `${COLLAPSED_SIDEBAR_WIDTH}px` : undefined,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <BrandHeader
          collapsed={collapsed}
          pinned={pinned}
          isMobile={isMobile}
          isServerMode={isServerMode}
          version={pkg.version}
          onBrandClick={() => {
            if (isMobile) {
              onMobileOpenChange?.(false);
            } else if (collapsed) {
              togglePinned();
            } else {
              navigateToView('dashboard', 'dashboard');
            }
          }}
          onTogglePinned={togglePinned}
        />

        {/* Workspace Switcher (Managed Mode only — standalone has a single implicit workspace) */}
        {isServerMode && isManagedMode ? (
          !collapsed && <WorkspaceSwitcher workspaceId={workspaceId} />
        ) : (
          !collapsed && (
            <div className="px-3 pt-3">
              <div className="flex items-center gap-2 rounded-lg border border-zyr0-hairline bg-white/[0.02] px-2 py-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate text-[11px] text-zyr0-text-dim">Local workspace</span>
              </div>
            </div>
          )
        )}

        {/* Main Navigation - Single scrollable container */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 pt-3">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-zyr0-text-faint">
              Workspace
            </div>
          )}
          <div className="space-y-0.5">{visiblePrimaryItems.map(renderItem)}</div>

          <ProjectsQuicklist
            projects={recentProjects.map(p => ({ id: p.id, name: p.name }))}
            loading={loadingRecentProjects}
            collapsed={collapsed}
            onSelect={handleProjectSelect}
            onViewAll={() => navigateToView('projects', 'projects')}
          />

          {/* Secondary group */}
          <div className="mt-2 border-t border-zyr0-hairline pt-2">
            {collapsed ? (
              <div className="mx-auto mb-1.5 h-px w-6 bg-zyr0-hairline" />
            ) : (
              <button
                type="button"
                onClick={() => setMoreOpen(open => !open)}
                aria-expanded={moreOpen}
                className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zyr0-text-faint transition-colors hover:text-zyr0-text-dim"
              >
                More
                <ChevronDown className={cn('h-3 w-3 transition-transform', moreOpen && 'rotate-180')} />
              </button>
            )}
            {(collapsed || moreOpen) && (
              <div className="space-y-0.5">{visibleSecondaryItems.map(renderItem)}</div>
            )}
          </div>
        </nav>

        {/* System Actions (Server Mode only) */}
        {isServerMode && (
          <div className="shrink-0 border-t border-zyr0-hairline p-2">
            {SYSTEM_ACTIONS.filter(item => !(isDesktop && item.id === 'logout')).map((item) => {
              const Icon = item.icon;
              const isLogout = item.id === 'logout';

              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex h-9 items-center rounded-xl text-[13px] text-zyr0-text-dim transition-colors hover:bg-white/[0.045] hover:text-zyr0-text',
                      collapsed ? 'justify-center px-0' : 'gap-3 px-3'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {!collapsed && item.label}
                  </a>
                );
              }

              // Projects the server is missing or behind on. Shown here because Server Sync is
              // where the user resolves them, and nothing else made drift visible.
              const pendingBadge = item.id === 'sync' && pendingCount > 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemAction(item)}
                  title={collapsed ? (pendingBadge ? `${item.label} (${pendingCount} not synced)` : item.label) : undefined}
                  aria-label={pendingBadge ? `${item.label} (${pendingCount} not synced)` : undefined}
                  className={cn(
                    'relative flex h-9 w-full items-center rounded-xl text-[13px] transition-colors',
                    collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                    isLogout
                      ? 'text-red-400/80 hover:bg-red-500/10 hover:text-red-300'
                      : 'text-zyr0-text-dim hover:bg-white/[0.045] hover:text-zyr0-text'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {!collapsed && item.label}
                  {pendingBadge && (
                    <span
                      className={cn(
                        'flex items-center justify-center rounded-full bg-zyr0-blue/20 text-[10px] font-medium text-zyr0-blue',
                        collapsed
                          ? 'absolute right-1 top-1 h-4 min-w-4 px-1'
                          : 'ml-auto h-4 min-w-4 px-1'
                      )}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <UserCard
          collapsed={collapsed}
          name={userName}
          creditsUsed={PLACEHOLDER_CREDITS_USED}
          creditsTotal={PLACEHOLDER_CREDITS_TOTAL}
          onSettings={() => onOpenSettings?.()}
          onLogout={
            isServerMode
              ? () => { void handleItemAction({ id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' }); }
              : undefined
          }
        />
      </div>
    </>
  );
}

// Wrapper component with Suspense boundary for Next.js 15
export function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<div className="w-full h-full bg-zyr0-obsidian" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
