'use client';

/**
 * components/home/HeroSection.tsx
 *
 * Full-viewport hero with:
 * - WebGL GLSL shader background (animated navy/electric blue)
 *   ported directly from the Stitch design file
 * - Three.js wireframe house (loaded dynamically — SSR disabled)
 * - Hero headline, subtext, dual CTA buttons
 * - Scroll indicator bounce animation
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

// Three.js component — must be loaded client-side only (no SSR)
const ThreeJsHouse = dynamic(() => import('./ThreeJsHouse'), { ssr: false });

// ─── GLSL Shader ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
  vec2 uv = v_texCoord;
  vec2 mouse = u_mouse / u_resolution;

  // Deep space/navy background
  vec3 color1 = vec3(0.043, 0.118, 0.357); // #0B1E5B Primary Navy
  vec3 color2 = vec3(0.039, 0.039, 0.039); // #0A0A0A Deep Black

  float noise = sin(uv.x * 10.0 + u_time * 0.5) * cos(uv.y * 10.0 - u_time * 0.3);
  vec3 finalColor = mix(color1, color2, uv.y + noise * 0.1);

  // Electric blue glow/mist — moves slowly over time
  float dist = distance(uv, vec2(0.5, 0.5) + vec2(sin(u_time * 0.2), cos(u_time * 0.2)) * 0.2);
  float glow = smoothstep(0.5, 0.0, dist);
  finalColor += vec3(0.118, 0.369, 1.0) * glow * 0.3; // #1E5EFF Electric Blue

  // Mouse interaction — subtle glow follows cursor
  float mouseGlow = smoothstep(0.25, 0.0, distance(uv, mouse));
  finalColor += vec3(0.118, 0.369, 1.0) * mouseGlow * 0.2;

  gl_FragColor = vec4(finalColor, 1.0);
}`;

// ─── WebGL Canvas Component ───────────────────────────────────────────────────

function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;
    const mouse = { x: 0.5, y: 0.5 };

    // Sync canvas size to its CSS layout size
    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const gl = canvas.getContext('webgl') || (canvas as any).getContext('experimental-webgl');
    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        mouse.y = (1 - (e.clientY - rect.top) / rect.height) * canvas.height;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

// ─── Hero Content ─────────────────────────────────────────────────────────────

const heroVariants: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero — Perez Premium Roofing"
    >
      {/* Video background removed for homepage — Shader + ThreeJS remain */}

      {/* WebGL Shader Background — layered above video */}
      <div className="absolute inset-0 z-[1] opacity-60">
        <HeroShader />
      </div>

      {/* Gradient overlay — ensures text legibility */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-surface/20 via-surface/50 to-surface pointer-events-none" />

      {/* ThreeJS House Background (covers full Hero section with grid and particles) */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <ThreeJsHouse />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center pt-0 pb-12 lg:-mt-8">

        {/* Left — Text Content */}
        <motion.div
          className="flex flex-col gap-6"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overline badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1 glass-panel rounded-full border-glass-primary mt-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
                Perez Premium Roofing
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-gradient leading-tight"
          >
            Experience You Can Rely On.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
          >
            Perez Premium Roofing is a family-owned roofing company serving homeowners and businesses
            throughout the Bay Area. Owner Joaquin Perez has worked in the roofing industry since 2000,
            bringing more than 25 years of hands-on experience to every project.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
          >
            After years of working in the industry, Joaquin established Perez Premium Roofing to provide
            customers with dependable roofing work, straightforward communication, and quality craftsmanship.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/contact"
              id="hero-cta-estimate"
              className="btn-primary font-button text-button px-8 py-4 rounded-md flex items-center gap-2 group"
            >
              Get a Free Estimate
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/services"
              id="hero-cta-services"
              className="btn-secondary glass-panel font-button text-button px-8 py-4 rounded-md flex items-center gap-2"
            >
              Explore Our Services
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 mt-4 pt-6 border-t border-white/10"
          >
            {[
              { value: `${BRAND.yearsExperience}+`, label: 'Years in Bay Area' },
              { value: '800+', label: 'Projects Completed' },
              { value: '100%', label: 'Client Recommended' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-headline-md text-headline-md text-primary font-extrabold">
                  {stat.value}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant text-xs uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Space placeholder for Three.js 3D Wireframe (house is rendered from background canvas) */}
        <motion.div
          className="hidden lg:block relative h-[600px] w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-label-md text-label-md text-on-surface-variant text-[10px] tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}

