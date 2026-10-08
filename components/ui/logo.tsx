'use client';

import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ width = 64, height = 64, className, priority = false }: LogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className ?? ''}`}
      style={{ width, height }}
    >
      <Image
        src="/zyr0-logo.png"
        alt="ZYR0 Studio Logo"
        width={width}
        height={height}
        className="w-full h-full object-contain drop-shadow-sm"
        priority={priority}
      />
    </div>
  );
}

