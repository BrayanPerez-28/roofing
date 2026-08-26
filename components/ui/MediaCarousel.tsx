'use client';

/**
 * components/ui/MediaCarousel.tsx
 *
 * Carousel de imágenes con:
 * - Avance de UNA imagen por clic (flechas o dots)
 * - Autoplay cada 3 segundos, loop infinito
 * - Pausa al hacer hover (desktop)
 * - Swipe táctil (mobile)
 * - Transición slide o fade suave
 * - Lazy loading via Next.js Image
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  src: string;
  alt: string;
}

interface MediaCarouselProps {
  slides: CarouselSlide[];
  autoplayInterval?: number;   // ms, default 3000
  transition?: 'fade' | 'slide';
  aspectRatio?: string;         // CSS aspect-ratio, default '16/9'
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  rounded?: boolean;
  objectFit?: 'cover' | 'contain';
}

export default function MediaCarousel({
  slides,
  autoplayInterval = 3000,
  transition = 'slide',
  aspectRatio = '16/9',
  className = '',
  showArrows = true,
  showDots = true,
  rounded = true,
  objectFit = 'cover',
}: MediaCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const touchStartX = useRef<number>(0);
  const isMoving    = useRef(false);   // debounce rápido para evitar doble-salto
  const total = slides.length;

  // Avanza UNA imagen hacia adelante
  const next = useCallback(() => {
    if (isMoving.current || total <= 1) return;
    isMoving.current = true;
    setCurrent((c) => (c + 1) % total);
    setTimeout(() => { isMoving.current = false; }, 520); // espera que termine la transición CSS
  }, [total]);

  // Retrocede UNA imagen
  const prev = useCallback(() => {
    if (isMoving.current || total <= 1) return;
    isMoving.current = true;
    setCurrent((c) => (c - 1 + total) % total);
    setTimeout(() => { isMoving.current = false; }, 520);
  }, [total]);

  // Ir a índice específico (dots)
  const goTo = useCallback((idx: number) => {
    if (isMoving.current || idx === current) return;
    isMoving.current = true;
    setCurrent(idx);
    setTimeout(() => { isMoving.current = false; }, 520);
  }, [current]);

  // Autoplay — cada 3 s, loop infinito, pausa en hover
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, autoplayInterval);
    return () => clearInterval(id);
  }, [paused, next, autoplayInterval, total]);

  // Swipe táctil
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };

  if (total === 0) return null;

  return (
    <div
      className={`relative select-none overflow-hidden ${rounded ? 'rounded-xl' : ''} ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {transition === 'slide' ? (
        /*
         * SLIDE — cada slide ocupa el 100% del contenedor visible.
         * El track flex mide total × 100% y se desplaza usando
         * translateX(-(current / total × 100)%) relativo a su propio ancho.
         * Esto equivale exactamente a avanzar UN slide por paso.
         */
        <div
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${(current / total) * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / total}%` }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={`object-${objectFit}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                loading={i === 0 ? 'eager' : 'lazy'}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        /* FADE — cada slide en posición absoluta, solo el activo es visible */
        slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className={`object-${objectFit}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              loading={i === 0 ? 'eager' : 'lazy'}
              priority={i === 0}
            />
          </div>
        ))
      )}

      {/* Sombras laterales para visibilidad de flechas */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/30 to-transparent pointer-events-none z-10" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/30 to-transparent pointer-events-none z-10" aria-hidden="true" />

      {/* Flechas de navegación */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots de paginación */}
      {showDots && total > 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5"
          role="tablist"
          aria-label="Navegación del carrusel"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Imagen ${i + 1}`}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      <div
        className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium"
        aria-live="polite"
      >
        {current + 1} / {total}
      </div>
    </div>
  );
}
