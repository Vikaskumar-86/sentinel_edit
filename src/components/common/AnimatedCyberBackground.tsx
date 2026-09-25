import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  label?: string;
  type: 'api' | 'gateway' | 'crypto' | 'particle';
  color: string;
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

interface EncryptedParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  alpha: number;
  size: number;
  color: string;
}

export const AnimatedCyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const mouseSmoothRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animFrameRef = useRef<number | null>(null);

  // Track mouse coordinates for smooth parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const targetX = e.clientX / window.innerWidth;
      const targetY = e.clientY / window.innerHeight;
      mouseSmoothRef.current.targetX = targetX;
      mouseSmoothRef.current.targetY = targetY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas Animation: Dynamic API Network, Glowing Lines, Data Pulses, Hex Nodes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color Palette
    const colors = {
      cyan: 'rgba(6, 182, 212, ',
      blue: 'rgba(59, 130, 246, ',
      purple: 'rgba(168, 85, 247, ',
      emerald: 'rgba(16, 185, 129, ',
    };

    // 1. Generate API Network Nodes
    const nodeCount = Math.min(42, Math.max(22, Math.floor(width / 45)));
    const labels = [
      '/api/v1/auth',
      'JWT:BEARER',
      'TLS_1.3:SEC',
      '/graphql:query',
      'SHA-256',
      'ZERO_TRUST:GATEWAY',
      '/v2/contracts',
      'RBAC:OK',
      'OAUTH_2.1',
      'CORS:STRICT',
      '/api/v3/scan',
      'MUTUAL_TLS',
    ];

    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const colorKeys = Object.keys(colors) as (keyof typeof colors)[];
      const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const hasLabel = i < labels.length && Math.random() > 0.3;

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: hasLabel ? Math.random() * 2 + 2.5 : Math.random() * 1.5 + 1.2,
        baseAlpha: Math.random() * 0.35 + 0.25,
        label: hasLabel ? labels[i % labels.length] : undefined,
        type: hasLabel ? 'api' : Math.random() > 0.6 ? 'gateway' : 'particle',
        color: colors[colorKey],
      });
    }

    // 2. Active Glowing Data Pulses traveling between connected nodes
    const pulses: Pulse[] = [];
    const maxPulses = 12;

    // 3. Floating Encrypted Hex Particles
    const hexSnippets = [
      '0x7F',
      '0x4A91',
      'AES256',
      'JWT',
      'SEC_200',
      '0101',
      'HMAC',
      '0xFF',
      '0x10C',
      'AUTH',
      'GCM',
    ];
    const encryptedParticles: EncryptedParticle[] = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      encryptedParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.35 - 0.1, // gently drifts upwards
        text: hexSnippets[Math.floor(Math.random() * hexSnippets.length)],
        alpha: Math.random() * 0.35 + 0.15,
        size: Math.floor(Math.random() * 3) + 9, // 9px to 11px
        color: Math.random() > 0.5 ? colors.cyan : colors.purple,
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse lerp
      const ms = mouseSmoothRef.current;
      ms.x += (ms.targetX - ms.x) * 0.05;
      ms.y += (ms.targetY - ms.y) * 0.05;
      setMousePos({ x: ms.x, y: ms.y });

      const mouseCanvasX = ms.x * width;
      const mouseCanvasY = ms.y * height;

      // Clear with transparency
      ctx.clearRect(0, 0, width, height);

      // --- Draw Network Lines & Connections ---
      const maxDistance = 165;
      const connectedPairs: [number, number][] = [];

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];

        // Move nodes gently with subtle mouse deflection
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        // Bounce on boundaries
        if (nodeA.x < -20) nodeA.x = width + 20;
        if (nodeA.x > width + 20) nodeA.x = -20;
        if (nodeA.y < -20) nodeA.y = height + 20;
        if (nodeA.y > height + 20) nodeA.y = -20;

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            connectedPairs.push([i, j]);
            const alphaRatio = 1 - dist / maxDistance;

            // Check distance to mouse cursor for interactive glow
            const midX = (nodeA.x + nodeB.x) / 2;
            const midY = (nodeA.y + nodeB.y) / 2;
            const mouseDist = Math.sqrt(
              (midX - mouseCanvasX) ** 2 + (midY - mouseCanvasY) ** 2
            );
            const mouseBoost = mouseDist < 200 ? (1 - mouseDist / 200) * 0.35 : 0;

            const lineAlpha = (alphaRatio * 0.18 + mouseBoost).toFixed(3);

            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = mouseBoost > 0.1 ? 1.4 : 0.8;
            ctx.stroke();
          }
        }
      }

      // --- Trigger & Update Data Pulses along lines ---
      if (pulses.length < maxPulses && connectedPairs.length > 0 && Math.random() < 0.08) {
        const randomPair = connectedPairs[Math.floor(Math.random() * connectedPairs.length)];
        pulses.push({
          fromNode: randomPair[0],
          toNode: randomPair[1],
          progress: 0,
          speed: Math.random() * 0.8 + 0.6,
          color: Math.random() > 0.4 ? colors.cyan : colors.emerald,
        });
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed * dt;

        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const na = nodes[pulse.fromNode];
        const nb = nodes[pulse.toNode];
        if (!na || !nb) {
          pulses.splice(i, 1);
          continue;
        }

        const px = na.x + (nb.x - na.x) * pulse.progress;
        const py = na.y + (nb.y - na.y) * pulse.progress;

        // Glowing pulse head
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${pulse.color}0.95)`;
        ctx.shadowColor = `${pulse.color}0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // --- Draw Nodes and Micro-Labels ---
      ctx.font = '9px "JetBrains Mono", monospace';
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Interaction proximity boost
        const dMouse = Math.sqrt((node.x - mouseCanvasX) ** 2 + (node.y - mouseCanvasY) ** 2);
        const mouseBoost = dMouse < 160 ? (1 - dMouse / 160) * 0.45 : 0;
        const currentAlpha = Math.min(0.9, node.baseAlpha + mouseBoost);

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${currentAlpha * 0.25})`;
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${currentAlpha})`;
        ctx.shadowColor = `${node.color}0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Micro-label for API endpoints / Zero-Trust tags
        if (node.label && (currentAlpha > 0.4 || mouseBoost > 0.05)) {
          ctx.fillStyle = `rgba(226, 232, 240, ${Math.min(0.85, currentAlpha + 0.1)})`;
          ctx.fillText(node.label, node.x + node.radius + 5, node.y + 3);
        }
      }

      // --- Draw Floating Encrypted Data Hex Particles ---
      ctx.font = '10px "JetBrains Mono", monospace';
      for (let i = 0; i < encryptedParticles.length; i++) {
        const ep = encryptedParticles[i];
        ep.x += ep.vx;
        ep.y += ep.vy;

        // wrap around vertically
        if (ep.y < -20) {
          ep.y = height + 20;
          ep.x = Math.random() * width;
        }

        ctx.fillStyle = `${ep.color}${ep.alpha})`;
        ctx.fillText(ep.text, ep.x, ep.y);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Parallax offsets for SVG layers (Shields, Circuit Traces)
  const parallaxX = (mousePos.x - 0.5) * 35;
  const parallaxY = (mousePos.y - 0.5) * 35;
  const shieldTiltX = (mousePos.y - 0.5) * -18;
  const shieldTiltY = (mousePos.x - 0.5) * 22;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#020617]">
      {/* 1. Ultra-Deep Dark Base Spatial Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#01040f] via-[#02071a] to-[#01030d]" />

      {/* 2. Interactive Cursor Torchlight / Neon Glow */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[140px] opacity-35 transition-transform duration-300 ease-out"
        style={{
          left: `calc(${mousePos.x * 100}% - 325px)`,
          top: `calc(${mousePos.y * 100}% - 325px)`,
          background:
            'radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(59,130,246,0.18) 40%, rgba(168,85,247,0.1) 60%, transparent 75%)',
        }}
      />

      {/* 3. Deep Atmospheric Cyber Neon Light Blooms (Cyan, Electric Blue, Violet, Emerald) */}
      <div className="absolute -top-32 left-[5%] w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[160px] animate-ambient-pulse pointer-events-none" />
      <div
        className="absolute top-[25%] -right-24 w-[650px] h-[650px] rounded-full bg-purple-600/12 blur-[170px] animate-ambient-pulse pointer-events-none"
        style={{ animationDelay: '3.5s' }}
      />
      <div
        className="absolute -bottom-36 left-[25%] w-[700px] h-[700px] rounded-full bg-blue-700/12 blur-[180px] animate-ambient-pulse pointer-events-none"
        style={{ animationDelay: '7s' }}
      />
      <div
        className="absolute top-[55%] left-[8%] w-[450px] h-[450px] rounded-full bg-emerald-600/10 blur-[150px] animate-ambient-pulse pointer-events-none"
        style={{ animationDelay: '5s' }}
      />

      {/* 4. Perspective Cyber Grid with Parallax Depth Shift */}
      <div
        className="absolute inset-[-40px] cyber-grid opacity-30 transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${parallaxX * 0.3}px, ${parallaxY * 0.3}px, 0)`,
        }}
      />
      <div className="absolute inset-0 cyber-dots opacity-20" />

      {/* 5. Subtle Circuit-Board Traces & Geometric API Bus Paths */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${parallaxX * 0.5}px, ${parallaxY * 0.5}px, 0)`,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circuitCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="circuitPurple" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
          <pattern id="pcbMicro" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 10 30 L 40 60 L 80 60"
              fill="none"
              stroke="rgba(6, 182, 212, 0.08)"
              strokeWidth="1"
            />
            <circle cx="10" cy="30" r="1.5" fill="rgba(6, 182, 212, 0.15)" />
            <circle cx="40" cy="60" r="1.5" fill="rgba(6, 182, 212, 0.15)" />
            <path
              d="M 70 80 L 70 50 L 50 30 L 20 30"
              fill="none"
              stroke="rgba(168, 85, 247, 0.06)"
              strokeWidth="1"
            />
            <circle cx="50" cy="30" r="1.5" fill="rgba(168, 85, 247, 0.15)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#pcbMicro)" />

        {/* Major Circuit Bus Lines */}
        <path
          d="M 0 180 L 180 180 L 260 260 L 520 260 L 580 320"
          fill="none"
          stroke="url(#circuitCyan)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <circle cx="180" cy="180" r="3" fill="#06b6d4" className="animate-pulse" />
        <circle cx="260" cy="260" r="2.5" fill="#38bdf8" />
        <circle cx="520" cy="260" r="3" fill="#10b981" />

        <path
          d="M 900 80 L 1100 80 L 1180 160 L 1400 160"
          fill="none"
          stroke="url(#circuitPurple)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <circle cx="1100" cy="80" r="3" fill="#a855f7" className="animate-pulse" />
        <circle cx="1180" cy="160" r="2.5" fill="#c084fc" />

        <path
          d="M 120 750 L 320 750 L 400 670 L 680 670"
          fill="none"
          stroke="url(#circuitCyan)"
          strokeWidth="1.2"
        />
        <circle cx="320" cy="750" r="3" fill="#06b6d4" />
        <circle cx="400" cy="670" r="2.5" fill="#22d3ee" />
      </svg>

      {/* 6. Abstract 3D Security Shields Floating in Spatial Depth with Parallax Tilt */}
      {/* Top-Right Ambient 3D Shield */}
      <div
        className="absolute top-[8%] right-[6%] pointer-events-none transition-transform duration-500 ease-out hidden md:block"
        style={{
          perspective: '1200px',
          transform: `translate3d(${parallaxX * 0.8}px, ${parallaxY * 0.8}px, 0)`,
        }}
      >
        <div
          className="relative w-56 h-64 transition-transform duration-300"
          style={{
            transform: `rotateX(${shieldTiltX}deg) rotateY(${shieldTiltY}deg) rotateZ(6deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer Holographic Glow Aura */}
          <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full" />

          {/* SVG 3D Multi-Layered Shield Geometry */}
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            {/* Outer Shield Wireframe */}
            <path
              d="M 100 15 L 180 45 L 180 120 C 180 180 100 225 100 225 C 100 225 20 180 20 120 L 20 45 Z"
              fill="rgba(6, 182, 212, 0.03)"
              stroke="rgba(6, 182, 212, 0.45)"
              strokeWidth="1.5"
            />
            {/* Inner Concentric Shield Ring */}
            <path
              d="M 100 35 L 160 58 L 160 115 C 160 162 100 198 100 198 C 100 198 40 162 40 115 L 40 58 Z"
              fill="rgba(2, 6, 23, 0.3)"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            {/* Zero-Trust Reticle Core Lines */}
            <line x1="100" y1="35" x2="100" y2="198" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1" />
            <line x1="40" y1="115" x2="160" y2="115" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1" />
            {/* Core Glowing Node */}
            <circle cx="100" cy="115" r="14" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx="100" cy="115" r="4" fill="#38bdf8" className="animate-ping" />
            {/* Tech Nodes */}
            <circle cx="100" cy="35" r="2.5" fill="#10b981" />
            <circle cx="180" cy="45" r="2.5" fill="#06b6d4" />
            <circle cx="20" cy="45" r="2.5" fill="#06b6d4" />
            <circle cx="100" cy="225" r="2.5" fill="#a855f7" />
          </svg>

          {/* Floating Telemetry Tag */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 whitespace-nowrap tracking-wider">
            ZERO-TRUST // SHIELD_V3
          </div>
        </div>
      </div>

      {/* Bottom-Left Ambient 3D Shield */}
      <div
        className="absolute bottom-[10%] left-[3%] pointer-events-none transition-transform duration-500 ease-out hidden lg:block"
        style={{
          perspective: '1200px',
          transform: `translate3d(${parallaxX * 0.6}px, ${parallaxY * 0.6}px, 0)`,
        }}
      >
        <div
          className="relative w-44 h-52 transition-transform duration-300 opacity-60"
          style={{
            transform: `rotateX(${shieldTiltX * 0.7}deg) rotateY(${shieldTiltY * 0.7}deg) rotateZ(-8deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <path
              d="M 100 20 L 175 48 L 175 120 C 175 175 100 215 100 215 C 100 215 25 175 25 120 L 25 48 Z"
              fill="rgba(168, 85, 247, 0.03)"
              stroke="rgba(168, 85, 247, 0.4)"
              strokeWidth="1.2"
            />
            <circle cx="100" cy="115" r="12" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="1.2" />
            <circle cx="100" cy="115" r="3" fill="#c084fc" />
          </svg>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-purple-500/30 text-[8px] font-mono text-purple-300 tracking-wider">
            ISOLATED // HOST_NODE
          </div>
        </div>
      </div>

      {/* 7. HTML5 Canvas: Interactive Glowing Network Lines, API Nodes, and Data Pulses */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ opacity: 0.92 }}
      />

      {/* 8. Sweeping Cyber Scanline Effect */}
      <div className="absolute inset-x-0 h-44 bg-gradient-to-b from-transparent via-cyan-400/[0.03] to-transparent animate-scanline pointer-events-none" />

      {/* 9. Soft Vignette Edge Shading for Maximum Text Contrast and Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/70 via-transparent to-[#020617]/70 pointer-events-none" />
    </div>
  );
};
