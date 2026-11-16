'use client';

import React from 'react';
// Use package.json version as fallback when env var is not provided
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON import for version string
import pkg from '../../package.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <Logo width={64} height={64} />
            <div>
              <DialogTitle className="text-2xl">ZYR0 Studio</DialogTitle>
              <DialogDescription className="text-base">
                Agentic Web Development Environment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-4">
          <section>
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
              <p>
                <strong>ZYR0 Studio</strong> is an AI-powered development environment where you build and maintain full websites and web applications through natural language conversations with agentic AI.
              </p>
              
              <p>
                Featuring support for multiple runtimes (Static, Handlebars, React, Preact, Svelte, Vue, Python, Lua), a sandboxed virtual file system with automated checkpoints, and multi-provider AI model orchestration.
              </p>

              <p>
                Created and maintained by <strong>Ilyas Khan</strong>.
              </p>
            </div>
          </section>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Badge variant="secondary" className="text-xs">
            v{process.env.NEXT_PUBLIC_APP_VERSION || pkg.version}
          </Badge>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
