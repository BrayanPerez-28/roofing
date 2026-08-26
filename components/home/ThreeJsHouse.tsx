'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HouseHologram() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Escena / Cámara / Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0.8, -0.2, 8.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Paleta de colores
    const neonColor = new THREE.Color(0x1e5eff);
    const coreColor = new THREE.Color(0x0b1e5b);
    const glowColor = new THREE.Color(0x8fb8ff);

    // 3. Iluminación
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const light1 = new THREE.PointLight(0x1e5eff, 4, 100);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x0b1e5b, 5, 100);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    // 4. Piso digital (grid) con pulso
    const gridHelper = new THREE.GridHelper(22, 44, neonColor, coreColor);
    gridHelper.position.y = -2.2;
    const gridMat = gridHelper.material as THREE.Material & {
      opacity: number;
      transparent: boolean;
    };
    gridMat.transparent = true;
    gridMat.opacity = 0.12;
    scene.add(gridHelper);

    // 5. Disco de luz radial bajo la casa
    const discGeo = new THREE.CircleGeometry(4, 64);
    const discMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color(0x1e5eff) } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        void main() {
          float d = distance(vUv, vec2(0.5));
          float a = smoothstep(0.5, 0.0, d) * 0.35;
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });
    const group = new THREE.Group();

    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(0, -2.19, 0.4);
    group.add(disc);

    // Material sólido translúcido "cristal tecnológico"
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: coreColor,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Constructor de líneas con efecto de brillo (núcleo + halo)
    function createHologramLines(geometry: THREE.BufferGeometry) {
      const edges = new THREE.EdgesGeometry(geometry);
      const holo = new THREE.Group();

      const coreLineMat = new THREE.LineBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.9,
      });
      holo.add(new THREE.LineSegments(edges, coreLineMat));

      const haloLineMat = new THREE.LineBasicMaterial({
        color: neonColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const haloLines = new THREE.LineSegments(edges, haloLineMat);
      haloLines.scale.setScalar(1.015);
      holo.add(haloLines);

      holo.add(new THREE.Mesh(geometry, coreMaterial));

      return holo;
    }

    function makeRectOutline(w: number, h: number, color: THREE.Color, opacity: number) {
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, 0);
      shape.lineTo(w / 2, 0);
      shape.lineTo(w / 2, h);
      shape.lineTo(-w / 2, h);
      shape.lineTo(-w / 2, 0);
      const geo = new THREE.ShapeGeometry(shape);
      const edges = new THREE.EdgesGeometry(geo);
      return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    }

    // ---- GEOMETRÍA DE LA CASA: estilo moderno con porche cubierto ----
    const floorY = -1.6;
    const wallHeight = 2.0;
    const wallTopY = floorY + wallHeight; // 0.4
    const houseWidth = 3.2;
    const halfW = houseWidth / 2; // 1.6
    const backZ = -1.6;
    const frontWallZ = 0.4; // pared que da al porche
    const porchFrontZ = 2.4; // borde del deck

    // Volumen principal cerrado
    const baseGeo = new THREE.BoxGeometry(houseWidth, wallHeight, frontWallZ - backZ);
    const houseBase = createHologramLines(baseGeo);
    houseBase.position.set(0, floorY + wallHeight / 2, (backZ + frontWallZ) / 2);
    group.add(houseBase);

    // Techo asimétrico: caída corta hacia atrás, gran alero sobre el porche
    const roofRidgeZ = -0.6;
    const roofRidgeY = 1.9;
    const roofBackEaveZ = -2.0;
    const roofBackEaveY = 0.55;
    const roofFrontEaveZ = 2.9;
    const roofFrontEaveY = 0.75;
    const roofWidth = houseWidth + 0.6;

    const roofShape = new THREE.Shape();
    roofShape.moveTo(roofRidgeZ, roofRidgeY);
    roofShape.lineTo(roofFrontEaveZ, roofFrontEaveY);
    roofShape.lineTo(roofBackEaveZ, roofBackEaveY);
    roofShape.lineTo(roofRidgeZ, roofRidgeY);

    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: roofWidth, bevelEnabled: false });
    roofGeo.translate(0, 0, -roofWidth / 2);
    roofGeo.rotateY(-Math.PI / 2);
    const roof = createHologramLines(roofGeo);
    group.add(roof);

    // Chimenea en el extremo del hastial (como en la referencia)
    const chimneyGeo = new THREE.BoxGeometry(0.45, 1.7, 0.45);
    const chimney = createHologramLines(chimneyGeo);
    chimney.position.set(-1.45, 1.05, -0.9);
    group.add(chimney);

    // Deck / piso del porche
    const deckDepth = porchFrontZ - frontWallZ;
    const deckGeo = new THREE.BoxGeometry(houseWidth + 0.3, 0.08, deckDepth);
    const deck = createHologramLines(deckGeo);
    deck.position.set(0, floorY + 0.04, frontWallZ + deckDepth / 2);
    group.add(deck);

    // Columnas del porche
    const pillarGeo = new THREE.CylinderGeometry(0.06, 0.06, roofFrontEaveY - floorY, 8);
    [-1.35, 0, 1.35].forEach((px) => {
      const pillar = createHologramLines(pillarGeo);
      pillar.position.set(px, (roofFrontEaveY + floorY) / 2, porchFrontZ - 0.15);
      group.add(pillar);
    });

    // Barandal del deck
    const railPositions: number[] = [];
    const railY = floorY + 0.75;
    const railZ = porchFrontZ - 0.02;
    for (let x = -halfW - 0.1; x <= halfW + 0.1; x += 0.4) {
      railPositions.push(x, floorY + 0.08, railZ, x, railY, railZ);
    }
    railPositions.push(-halfW - 0.15, railY, railZ, halfW + 0.15, railY, railZ);
    const railGeo = new THREE.BufferGeometry();
    railGeo.setAttribute('position', new THREE.Float32BufferAttribute(railPositions, 3));
    const railLine = new THREE.LineSegments(
      railGeo,
      new THREE.LineBasicMaterial({ color: glowColor, transparent: true, opacity: 0.55 })
    );
    group.add(railLine);

    // Ventanal corredizo en la pared que da al porche
    const frontGlass = makeRectOutline(2.6, 1.5, glowColor, 0.6);
    frontGlass.position.set(0, floorY + 0.5, frontWallZ + 0.001);
    group.add(frontGlass);
    const frontGlassMid = makeRectOutline(0.02, 1.5, glowColor, 0.4);
    frontGlassMid.position.set(0, floorY + 0.5, frontWallZ + 0.002);
    group.add(frontGlassMid);

    // Ventanas laterales y trasera
    const winLeft = makeRectOutline(0.7, 0.7, glowColor, 0.55);
    winLeft.rotation.y = Math.PI / 2;
    winLeft.position.set(-halfW - 0.001, floorY + 1.1, -0.3);
    group.add(winLeft);

    const winRight = makeRectOutline(0.7, 0.7, glowColor, 0.55);
    winRight.rotation.y = Math.PI / 2;
    winRight.position.set(halfW + 0.001, floorY + 1.1, -0.3);
    group.add(winRight);

    const winBack = makeRectOutline(0.9, 0.6, glowColor, 0.45);
    winBack.position.set(0.5, floorY + 1.1, backZ - 0.001);
    group.add(winBack);

    // Camino de piedra hacia el jardín
    const stoneMat = new THREE.LineBasicMaterial({ color: neonColor, transparent: true, opacity: 0.5 });
    [
      [0.1, 2.9],
      [-0.35, 3.4],
      [0.15, 3.9],
      [-0.2, 4.4],
    ].forEach(([sx, sz]) => {
      const stoneGeo = new THREE.CircleGeometry(0.26, 20);
      const edges = new THREE.EdgesGeometry(stoneGeo);
      const stone = new THREE.LineSegments(edges, stoneMat);
      stone.rotation.x = -Math.PI / 2;
      stone.position.set(sx, floorY + 0.01, sz);
      group.add(stone);
    });

    // Nodos brillantes en los vértices clave (efecto "circuito")
    const nodePositions: number[] = [];
    const houseCorners = [
      [-roofWidth / 2, roofRidgeY, roofRidgeZ], [roofWidth / 2, roofRidgeY, roofRidgeZ],
      [-roofWidth / 2, roofFrontEaveY, roofFrontEaveZ], [roofWidth / 2, roofFrontEaveY, roofFrontEaveZ],
      [-roofWidth / 2, roofBackEaveY, roofBackEaveZ], [roofWidth / 2, roofBackEaveY, roofBackEaveZ],
      [-halfW, floorY, porchFrontZ], [halfW, floorY, porchFrontZ],
      [-halfW, wallTopY, backZ], [halfW, wallTopY, backZ],
      [-1.45, 1.9, -0.9],
    ];
    houseCorners.forEach((p) => nodePositions.push(...p));
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));

    const nodeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x8fb8ff) },
      },
      vertexShader: `
        uniform float uTime;
        varying float vTwinkle;
        void main() {
          vTwinkle = 0.6 + 0.4 * sin(uTime * 2.0 + position.x * 3.0 + position.y * 2.0);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 6.0 * vTwinkle * (10.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vTwinkle;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vTwinkle;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    group.add(new THREE.Points(nodeGeo, nodeMaterial));

    scene.add(group);

    // ---- Línea de escaneo que atraviesa la casa ----
    const scanGeo = new THREE.PlaneGeometry(5.5, 0.6);
    const scanMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(0x1e5eff) } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        void main() {
          float a = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
          gl_FragColor = vec4(uColor, a * 0.4);
        }
      `,
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.rotation.x = -Math.PI / 2;
    scanPlane.position.z = 0.4;
    group.add(scanPlane);

    // ---- Partículas flotantes ambientales ----
    const particleCount = 130;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 15;
      particlePos[i * 3 + 1] = Math.random() * 8 - 2;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePos, 3));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x1e5eff) },
      },
      vertexShader: `
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.3 + position.x) * 0.3;
          vAlpha = 0.3 + 0.3 * sin(uTime + position.z * 2.0);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = 2.5 * (12.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          gl_FragColor = vec4(uColor, vAlpha);
        }
      `,
    });
    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);

    // ---- Interactividad y animación ----
    let targetX = 0;
    let targetY = 0;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (event.clientX - windowHalfX) * 0.0015;
      targetY = (event.clientY - windowHalfY) * 0.0015;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotación constante + inclinación por mouse (parallax suavizado)
      group.rotation.y += 0.001;
      group.rotation.x += (targetY - group.rotation.x) * 0.02;
      group.rotation.z += (targetX - group.rotation.z) * 0.02;

      // Levitación
      group.position.y = Math.sin(t * 0.6) * 0.15;

      // Línea de escaneo sube y baja atravesando la casa
      scanPlane.position.y = Math.sin(t * 0.5) * 2.6;

      // Pulso del grid
      gridMat.opacity = 0.08 + Math.abs(Math.sin(t * 0.4)) * 0.08;

      // Pulso del disco de luz
      disc.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);

      nodeMaterial.uniforms.uTime.value = t;
      particleMaterial.uniforms.uTime.value = t;

      renderer.render(scene, camera);
    };
    animate();

    const updateHouseLayout = (w: number, h: number) => {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (w >= 1024) {
        group.visible = true;
        const visibleWidth = 2 * 8.2 * Math.tan((45 * Math.PI / 180) / 2) * camera.aspect;
        group.position.x = visibleWidth * 0.22;
      } else {
        group.visible = false;
      }
    };

    updateHouseLayout(width, height);

    const handleResize = () => {
      if (!container) return;
      updateHouseLayout(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      baseGeo.dispose();
      roofGeo.dispose();
      chimneyGeo.dispose();
      deckGeo.dispose();
      pillarGeo.dispose();
      railGeo.dispose();
      nodeGeo.dispose();
      particleGeo.dispose();
      scanGeo.dispose();
      discGeo.dispose();
      coreMaterial.dispose();
      nodeMaterial.dispose();
      particleMaterial.dispose();
      scanMat.dispose();
      discMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full bg-transparent pointer-events-none"
    />
  );
}