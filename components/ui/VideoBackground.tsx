'use client';

/**
 * components/ui/VideoBackground.tsx
 *
 * Reusable full-cover video background.
 * - Autoplay, muted, loop, playsInline
 * - object-fit: cover
 * - Configurable dark overlay (default 50%)
 * - Static image fallback if video cannot play
 */

import { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  fallbackImage?: string;
  overlayOpacity?: number; // 0–1, default 0.5
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export default function VideoBackground({
  src,
  fallbackImage,
  overlayOpacity = 0.52,
  className = '',
  children,
  'aria-label': ariaLabel,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Attempt autoplay; if it fails, show fallback
    video.play().catch(() => setVideoFailed(true));
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-label={ariaLabel}>
      {/* Video layer */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
        />
      )}

      {/* Fallback image if video fails */}
      {(videoFailed && fallbackImage) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Dark overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(10,12,20,${overlayOpacity + 0.15}) 0%, rgba(10,12,20,${overlayOpacity}) 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Content sits above */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
