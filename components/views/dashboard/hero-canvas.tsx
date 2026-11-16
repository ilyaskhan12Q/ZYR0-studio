'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Deep-charcoal canvas with an ambient mesh glow behind the prompt area.
 *
 * Four blurred radial gradients are composited with `screen` so they read as a light source rather
 * than a flat wash. Everything is CSS — no canvas, no images — and the drift animation is disabled
 * under `prefers-reduced-motion`.
 */
export function HeroCanvas({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('zyr0-hero relative overflow-hidden bg-zyr0-obsidian', className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="zyr0-mesh zyr0-mesh-blue zyr0-mesh-drift left-[-10%] top-[-16%] h-[440px] w-[620px]" />
        <div className="zyr0-mesh zyr0-mesh-gold zyr0-mesh-drift left-[42%] top-[-10%] h-[360px] w-[520px] [animation-delay:-7s]" />
        <div className="zyr0-mesh zyr0-mesh-violet zyr0-mesh-drift left-[16%] top-[4%] h-[420px] w-[560px] [animation-delay:-12s]" />
        <div className="zyr0-mesh zyr0-mesh-coral zyr0-mesh-drift left-[66%] top-[14%] h-[320px] w-[440px] [animation-delay:-4s]" />
        <div className="zyr0-grid" />
        {/* Fade the canvas out where the gallery panel overlaps it. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-zyr0-obsidian" />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
