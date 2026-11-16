import React from 'react';

export interface SidebarSubItem {
  id: string;
  label: string;
  icon: React.ElementType;
  /** Docs sub-items carry the markdown file they open. */
  file?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  action?: string;
  href?: string;
  serverModeOnly?: boolean;
  adminOnly?: boolean;
  managedOnly?: boolean;
  subItems?: SidebarSubItem[];
}

export interface QuickProject {
  id: string;
  name: string;
}
