export interface GalleryProject {
  id: string;
  name: string;
  description: string | null;
  /** ISO timestamp. */
  updatedAt: string;
  /** Base64 data URL captured when the project thumbnail was last updated. */
  previewImage?: string;
}

export interface GalleryTemplate {
  id: string;
  name: string;
  description?: string;
  isBuiltIn: boolean;
}

export type GalleryTab = 'search' | 'projects' | 'recent' | 'templates';
