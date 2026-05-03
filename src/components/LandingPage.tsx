'use client';

import { useState, useEffect, useRef } from 'react';
import { mockTokens } from '@/data/mockData';

interface LandingPageProps {
  onEnter: () => void;
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  brightness: number;
  targetBrightness: number;
  id: number;
  pulsePhase: number;
  tokenName: string;
  isDragging?: boolean;
  dragOffsetX?: number;
  dragOffsetY?: number;
  dragScreenX?: number;
  dragScreenY?: number;
}

interface MousePos {
  x: number;
  y: number;
}

interface ProjectedNode {
  x: number;
  y: number;
  z: number;
  scale: number;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node3D[]>([]);
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(false);
  const [cursor, setCursor] = useState<'default' | 'grab' | 'grabbing'>('default');
  const draggedNodeRef = useRef<Node3D | null>(null);
  const cursorRef = useRef<'default' | 'grab' | 'grabbing'>('default');
  const projectedNodesRef = useRef<ProjectedNode[]>([]);

  const setCanvasCursor = (next: 'default' | 'grab' | 'grabbing') => {
    cursorRef.current = next;
    setCursor(next);
  };

  const getCanvasPoint = (clientX: number, clientY: number) => {
    if (!canvasRef.current) {
      return null;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Initialize 3D network nodes
  useEffect(() => {
    // Create icosphere-like node distribution
    const initializeNodes = () => {
      const nodes: Node3D[] = [];
      const nodeCount = Math.min(45, mockTokens.length + 10);
      
      // Extend mockTokens if we need more nodes
      const tokenNames = mockTokens.map(t => t.name);
      while (tokenNames.length < nodeCount) {
        tokenNames.push(`Token ${tokenNames.length + 1}`);
      }

      // Generate nodes distributed across 3D sphere
      for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * 2 * Math.PI;
        const radius = 150 + Math.random() * 100;

        nodes.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta),
          z: radius * Math.cos(phi),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          vz: (Math.random() - 0.5) * 0.4,
          brightness: 0.3 + Math.random() * 0.7,
          targetBrightness: 0.3 + Math.random() * 0.7,
          id: i,
          pulsePhase: Math.random() * Math.PI * 2,
          tokenName: tokenNames[i],
          isDragging: false,
          dragOffsetX: 0,
          dragOffsetY: 0,
        });
      }
      nodesRef.current = nodes;
    };

    initializeNodes();

    // Handle mouse movement
    const updateInteraction = (clientX: number, clientY: number) => {
      mouseRef.current = { x: clientX, y: clientY };

      const point = getCanvasPoint(clientX, clientY);
      if (!point) {
        return;
      }

      const { x: mouseX, y: mouseY } = point;

      if (draggedNodeRef.current) {
        const node = draggedNodeRef.current;
        const dragX = mouseX + (node.dragOffsetX ?? 0);
        const dragY = mouseY + (node.dragOffsetY ?? 0);
        node.dragScreenX = dragX;
        node.dragScreenY = dragY;
        setCanvasCursor('grabbing');
        return;
      }

      let nextCursor: 'default' | 'grab' = 'default';
      for (let i = 0; i < projectedNodesRef.current.length; i++) {
        const proj = projectedNodesRef.current[i];
        const distance = Math.sqrt((mouseX - proj.x) ** 2 + (mouseY - proj.y) ** 2);
        if (distance < 28) {
          nextCursor = 'grab';
          break;
        }
      }
      if (cursorRef.current !== nextCursor) {
        setCanvasCursor(nextCursor);
      }
    };

    const startDragging = (clientX: number, clientY: number) => {
      const point = getCanvasPoint(clientX, clientY);
      if (!point) {
        return false;
      }

      const { x: mouseX, y: mouseY } = point;

      // Check if click is near any projected node
      for (let i = 0; i < projectedNodesRef.current.length; i++) {
        const proj = projectedNodesRef.current[i];
        const distance = Math.sqrt(
          (mouseX - proj.x) ** 2 + (mouseY - proj.y) ** 2
        );

        // Click radius of ~30px for touch-friendly interaction
        if (distance < 30) {
          const node = nodesRef.current[i];
          const dragOffsetX = proj.x - mouseX;
          const dragOffsetY = proj.y - mouseY;
          node.isDragging = true;
          node.dragOffsetX = dragOffsetX;
          node.dragOffsetY = dragOffsetY;
          node.dragScreenX = proj.x;
          node.dragScreenY = proj.y;
          draggedNodeRef.current = node;
          setCanvasCursor('grabbing');
          return true;
        }
      }

      return false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateInteraction(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      startDragging(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      if (startDragging(touch.clientX, touch.clientY)) {
        e.preventDefault();
      }
      updateInteraction(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      if (draggedNodeRef.current) {
        e.preventDefault();
      }
      updateInteraction(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => {
      if (draggedNodeRef.current) {
        draggedNodeRef.current.isDragging = false;
        draggedNodeRef.current = null;
      }
      setCanvasCursor('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchcancel', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
    };
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.visualViewport?.addEventListener('resize', resizeCanvas);
    window.visualViewport?.addEventListener('scroll', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps

      // Clear the frame fully so there is no trail effect.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0a0f1f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      rotationRef.current.y += 0.00018;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const normalizedMouseX = (mouseRef.current.x - centerX) / centerX;
      const normalizedMouseY = (mouseRef.current.y - centerY) / centerY;

      // Update nodes
      nodesRef.current.forEach((node) => {
        const distanceToMouse = Math.sqrt(
          (node.x / 2 - normalizedMouseX * 120) ** 2 +
          (node.y / 2 - normalizedMouseY * 120) ** 2
        );

        const repelStrength = Math.max(0, 0.6 - distanceToMouse / 250);
        if (!node.isDragging) {
          node.vx += (node.x / 2 - normalizedMouseX * 120) * 0.00008 * repelStrength;
          node.vy += (node.y / 2 - normalizedMouseY * 120) * 0.00008 * repelStrength;
        } else if (node.dragScreenX !== undefined && node.dragScreenY !== undefined) {
          // Keep the dragged node visually under the cursor.
          const desiredX = node.dragScreenX;
          const desiredY = node.dragScreenY;
          const projectedScale = 500 / (500 + node.z);
          node.x = (desiredX - centerX) / projectedScale;
          node.y = (desiredY - centerY) / projectedScale;
          node.vx = 0;
          node.vy = 0;
        }

        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        const dist = Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z);
        if (dist > 280) {
          const scale = 280 / dist;
          node.x *= scale;
          node.y *= scale;
          node.z *= scale;
        }
        if (dist < 100) {
          const scale = 100 / dist;
          node.x *= scale;
          node.y *= scale;
          node.z *= scale;
        }

        node.vx *= 0.994;
        node.vy *= 0.994;
        node.vz *= 0.994;

        if (Math.random() < 0.006) {
          node.vx += (Math.random() - 0.5) * 0.12;
          node.vy += (Math.random() - 0.5) * 0.12;
          node.vz += (Math.random() - 0.5) * 0.12;
        }

        node.brightness = 0.72;
      });

      const projectNode = (node: Node3D) => {
        const perspective = 500;
        const z = node.z;
        const scale = perspective / (perspective + z);

        if (node.isDragging && node.dragScreenX !== undefined && node.dragScreenY !== undefined) {
          return {
            x: node.dragScreenX,
            y: node.dragScreenY,
            z,
            scale,
          };
        }

        let x = node.x;
        let y = node.y;

        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);
        const tempX = x * cosY - z * sinY;
        let tempZ = x * sinY + z * cosY;
        x = tempX;
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const tempY = y * cosX - tempZ * sinX;
        tempZ = y * sinX + tempZ * cosX;
        y = tempY;

        return {
          x: centerX + x * scale,
          y: centerY + y * scale,
          z,
          scale,
        };
      };

      const projectedNodes = nodesRef.current.map(projectNode);
      projectedNodesRef.current = projectedNodes;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const node1 = nodesRef.current[i];
          const node2 = nodesRef.current[j];
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const dz = node2.z - node1.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 180) {
            const p1 = projectedNodes[i];
            const p2 = projectedNodes[j];
            const opacityFactor = 1 - dist / 180;
            const baseBrightness = (node1.brightness + node2.brightness) / 2;
            const lineOpacity = opacityFactor * baseBrightness * 0.55;

            ctx.strokeStyle = `rgba(34, 211, 238, ${lineOpacity})`;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      projectedNodes.forEach((proj, idx) => {
        const node = nodesRef.current[idx];
        const isDragging = node.isDragging || false;
        const baseSize = isDragging ? 2.7 : 1.5;
        const size = baseSize * proj.scale;

        const coreColor = isDragging ? 'rgba(59, 130, 246' : 'rgba(34, 211, 238';
        ctx.fillStyle = `${coreColor}, 0.78)`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (proj.y < canvas.height - 50) {
          ctx.font = 'bold 11px Arial';
          ctx.fillStyle = isDragging ? 'rgba(59, 130, 246, 0.95)' : 'rgba(34, 211, 238, 0.6)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const nameLength = node.tokenName.length;
          const maxWidth = nameLength * 7;
          ctx.fillText(node.tokenName, proj.x, proj.y - size - 8, maxWidth);
        }

        if (isDragging) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, size * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.visualViewport?.removeEventListener('resize', resizeCanvas);
      window.visualViewport?.removeEventListener('scroll', resizeCanvas);
    };
  }, []);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div
      className="viewport-shell relative w-full overflow-hidden bg-black select-none"
      style={{
        touchAction: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        MozUserSelect: 'none',
        userSelect: 'none',
        cursor,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        draggable={false}
        className="absolute inset-0 w-full h-full select-none"
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          cursor,
          background: 'radial-gradient(ellipse at center, rgba(10, 15, 31, 0) 0%, rgba(10, 15, 31, 1) 100%)',
        }}
      />

      {/* Overlay gradients for depth and polish */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-black/5 to-slate-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Aurora glow effects for ambiance */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-float-alt" />

      {/* Content - centered and interactive */}
      <div
        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center z-10 px-4 transition-all duration-700 ${
          isEntering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Logo / Brand Name with glow */}
        <div className="mb-10 text-center">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-12 duration-1000 decoration-clone drop-shadow-lg">
              SENTRA LABS
            </span>
          </h1>
          {/* Decorative scanning line */}
          <div className="mt-6 h-0.5 w-48 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-in fade-in duration-1000 animation-delay-200" />
          <div className="mt-1 h-px w-64 mx-auto bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-in fade-in duration-1000 animation-delay-300" />
        </div>

        {/* Main tagline */}
        <div className="mb-12 text-center max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 animation-delay-400">
          <p className="text-xl md:text-2xl font-light tracking-wide">
            <span className="text-cyan-400">On-chain Intelligence</span>
            <span className="text-gray-500 mx-3">•</span>
            <span className="text-blue-400">Launch Detection</span>
            <span className="text-gray-500 mx-3">•</span>
            <span className="text-cyan-300">Signal Analysis</span>
          </p>
          <p className="text-gray-400 text-sm mt-6 font-light leading-relaxed">
            Real-time blockchain analysis and token launch detection.
            <br />
            Enter the intelligence portal.
          </p>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleEnter}
          className="group relative px-1 py-1 rounded-lg font-semibold text-white transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 duration-1000 animation-delay-600 active:scale-95 hover:shadow-2xl hover:shadow-cyan-500/30"
        >
          {/* Gradient border background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

          {/* Button inner content */}
          <div className="ios-backdrop-sm relative flex items-center gap-3 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-blue-950/60 to-cyan-950/60 px-10 py-4 transition-all duration-300 hover:border-cyan-400/60 group-hover:from-blue-900/70 group-hover:to-cyan-900/70">
            <span className="text-lg">Enter the Lab</span>
            <span className="text-xl group-hover:translate-x-1 group-hover:drop-shadow-lg transition-all duration-300">→</span>
          </div>
        </button>

        {/* Bottom hint with animation */}
        <div className="mt-24 text-center animate-in fade-in duration-1000 animation-delay-700">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            <span className="inline-block animate-pulse">●</span>
            <span className="mx-2">Network Online</span>
            <span className="inline-block animate-pulse">●</span>
          </p>
          <p className="mt-3 text-xs text-gray-600">Move your cursor or drag with touch to interact with the network</p>
        </div>
      </div>
    </div>
  );
}
