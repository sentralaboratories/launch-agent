'use client';

import { useEffect, useRef } from 'react';

interface DashboardBackgroundProps {
  className?: string;
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
}

interface ProjectedNode {
  x: number;
  y: number;
  z: number;
  scale: number;
}

export default function DashboardBackground({ className = '' }: DashboardBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node3D[]>([]);
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const projectedNodesRef = useRef<ProjectedNode[]>([]);

  // Initialize 3D network nodes
  useEffect(() => {
    const initializeNodes = () => {
      const nodes: Node3D[] = [];
      const nodeCount = 35; // Fewer nodes for dashboard background

      for (let i = 0; i < nodeCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * 2 * Math.PI;
        const radius = 120 + Math.random() * 80;

        nodes.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta),
          z: radius * Math.cos(phi),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          vz: (Math.random() - 0.5) * 0.3,
          brightness: 0.2 + Math.random() * 0.6,
          targetBrightness: 0.2 + Math.random() * 0.6,
          id: i,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      nodesRef.current = nodes;
    };

    initializeNodes();
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

      // Clear the frame fully
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      rotationRef.current.y += 0.00012; // Slower rotation for subtle effect

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update nodes
      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        const dist = Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z);
        if (dist > 240) {
          const scale = 240 / dist;
          node.x *= scale;
          node.y *= scale;
          node.z *= scale;
        }
        if (dist < 80) {
          const scale = 80 / dist;
          node.x *= scale;
          node.y *= scale;
          node.z *= scale;
        }

        node.vx *= 0.996;
        node.vy *= 0.996;
        node.vz *= 0.996;

        if (Math.random() < 0.004) {
          node.vx += (Math.random() - 0.5) * 0.08;
          node.vy += (Math.random() - 0.5) * 0.08;
          node.vz += (Math.random() - 0.5) * 0.08;
        }

        node.brightness = 0.6;
      });

      const projectNode = (node: Node3D) => {
        const perspective = 400;
        const z = node.z;
        const scale = perspective / (perspective + z);

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

      // Draw connections
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const node1 = nodesRef.current[i];
          const node2 = nodesRef.current[j];
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const dz = node2.z - node1.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 140) {
            const p1 = projectedNodes[i];
            const p2 = projectedNodes[j];
            const opacityFactor = 1 - dist / 140;
            const baseBrightness = (node1.brightness + node2.brightness) / 2;
            const lineOpacity = opacityFactor * baseBrightness * 0.4;

            ctx.strokeStyle = `rgba(34, 211, 238, ${lineOpacity})`;
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(34, 211, 238, 0.2)';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw nodes
      projectedNodes.forEach((proj, idx) => {
        const node = nodesRef.current[idx];
        const baseSize = 1.2;
        const size = baseSize * proj.scale;

        ctx.fillStyle = `rgba(34, 211, 238, 0.06)`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        const middleGlowColor = 'rgba(34, 211, 238';
        const middleGlowOpacity = 0.12;
        ctx.fillStyle = `${middleGlowColor}, ${middleGlowOpacity})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size * 1.8, 0, Math.PI * 2);
        ctx.fill();

        const coreColor = 'rgba(34, 211, 238';
        ctx.fillStyle = `${coreColor}, 0.6)`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fill();
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

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        background: 'transparent',
      }}
    />
  );
}