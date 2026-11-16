'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppWindow,
  ArrowUp,
  ChevronDown,
  Image as ImageIcon,
  Paperclip,
  Video,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { configManager } from '@/lib/config/storage';

export interface CommandSubmission {
  prompt: string;
  /** File names only — see the note on the attach control below. */
  attachments: string[];
}

interface CommandBarProps {
  onSubmit: (submission: CommandSubmission) => void;
  onOpenModelSettings: () => void;
}

const QUICK_ACTIONS = [
  { id: 'app', label: 'Create an app', icon: AppWindow, starter: 'Create a responsive web app for ' },
  { id: 'image', label: 'Generate image', icon: ImageIcon, starter: 'Generate an image of ' },
  { id: 'video', label: 'Generate video', icon: Video, starter: 'Generate a short video of ' },
] as const;

/**
 * Glassmorphic prompt bar.
 *
 * This is a launcher, not the agent: submitting opens the create-project dialog with the prompt
 * already in the description, because the agent itself only exists once a project is open.
 *
 * Attachments are collected by name and passed through as reference text. They are not uploaded —
 * an asset has to be added inside the studio once a project exists, so the UI says "reference"
 * rather than implying the file is carried into the project.
 */
export function CommandBar({ onSubmit, onOpenModelSettings }: CommandBarProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [modelLabel, setModelLabel] = useState('Auto');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read the configured model after mount: configManager touches localStorage.
  useEffect(() => {
    try {
      const model = configManager.getDefaultModel();
      if (model) setModelLabel(model.split('/').pop() || model);
    } catch {
      // No provider configured yet — "Auto" is the correct label.
    }
  }, []);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, []);

  const submit = useCallback(() => {
    const prompt = value.trim();
    if (!prompt && attachments.length === 0) return;
    onSubmit({ prompt, attachments });
    setValue('');
    setAttachments([]);
    requestAnimationFrame(resize);
  }, [value, attachments, onSubmit, resize]);

  const applyStarter = (starter: string) => {
    setValue(prev => (prev ? prev : starter));
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      const el = textareaRef.current;
      if (el) el.setSelectionRange(el.value.length, el.value.length);
      resize();
    });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(e.target.files ?? []).map(file => file.name);
    if (names.length > 0) {
      setAttachments(prev => Array.from(new Set([...prev, ...names])).slice(0, 5));
    }
    e.target.value = '';
  };

  const canSubmit = value.trim().length > 0 || attachments.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={cn(
          'relative rounded-2xl border border-zyr0-hairline-strong bg-white/[0.05] p-2 backdrop-blur-xl',
          'shadow-[0_24px_70px_-24px_rgba(0,0,0,0.9)] transition-colors',
          'focus-within:border-white/25 focus-within:bg-white/[0.07]'
        )}
      >
        <div className="flex items-start gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach reference files"
            aria-label="Attach reference files"
            className="mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zyr0-text-faint transition-colors hover:bg-white/10 hover:text-zyr0-text"
          >
            <Paperclip className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFiles}
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); resize(); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="What's on your mind, Ilyas?"
            aria-label="Describe what you want to build"
            className="min-h-[38px] w-full resize-none bg-transparent px-1 py-2 text-sm leading-relaxed text-zyr0-text outline-none placeholder:text-zyr0-text-faint"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            title="Start a project from this prompt"
            aria-label="Start a project from this prompt"
            className={cn(
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
              canSubmit
                ? 'bg-zyr0-blue text-white shadow-lg shadow-zyr0-blue/30 hover:bg-blue-500'
                : 'bg-white/5 text-zyr0-text-faint'
            )}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1 pb-1 pt-2">
            {attachments.map((name) => (
              <span
                key={name}
                className="flex max-w-[200px] items-center gap-1 rounded-md border border-zyr0-hairline bg-white/5 px-1.5 py-0.5 text-[10px] text-zyr0-text-dim"
              >
                <span className="truncate">{name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(prev => prev.filter(n => n !== name))}
                  aria-label={`Remove ${name}`}
                  className="text-zyr0-text-faint transition-colors hover:text-zyr0-text"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-1 pt-1.5">
          <button
            type="button"
            onClick={onOpenModelSettings}
            title="Change the model that builds this"
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-zyr0-text-faint transition-colors hover:bg-white/5 hover:text-zyr0-text-dim"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zyr0-blue" />
            <span className="max-w-[160px] truncate">{modelLabel}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <span className="hidden text-[10px] text-zyr0-text-faint sm:block">
            ↵ to start · ⇧↵ for a new line
          </span>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => applyStarter(action.starter)}
              className="flex items-center gap-1.5 rounded-full border border-zyr0-hairline bg-white/[0.03] px-3 py-1.5 text-[11px] text-zyr0-text-dim transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-zyr0-text"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
