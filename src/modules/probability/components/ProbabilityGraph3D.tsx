import React, { useRef, useEffect, useState } from 'react';
import type { ProbabilityPoint3D } from '../types';

interface Props {
  data: ProbabilityPoint3D[]; 
  resolution: number; 
  type: 'discrete' | 'continuous';
  zLabel?: string;
}

// 1. Define strict types for our 3D projection logic
interface ProjectedPoint {
  u: number;     // Screen X
  v: number;     // Screen Y
  depth: number; // Z-depth for sorting
}

interface Quad {
  points: [ProjectedPoint, ProjectedPoint, ProjectedPoint, ProjectedPoint]; // Always 4 points
  color: string;
  depth: number; // Average depth of the quad
  stroke: string;
}

export const ProbabilityGraph3D: React.FC<Props> = ({ data, resolution, type, zLabel = "Prob" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [rotation, setRotation] = useState({ x: 0.8, z: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const getColor = (value: number) => {
    const hue = (1 - value) * 240;
    return `hsl(${hue}, 80%, 60%)`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // SETUP
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    
    const xVals = data.map(d => d.x);
    const yVals = data.map(d => d.y);
    const zVals = data.map(d => d.z);
    
    const xMin = Math.min(...xVals), xMax = Math.max(...xVals);
    const yMin = Math.min(...yVals), yMax = Math.max(...yVals);
    const zMin = 0, zMax = Math.max(...zVals) || 1;

    const project = (x: number, y: number, z: number): ProjectedPoint => {
      const nx = (x - xMin) / (xMax - xMin || 1) * 2 - 1;
      const ny = (y - yMin) / (yMax - yMin || 1) * 2 - 1;
      const nz = (z - zMin) / (zMax - zMin || 1);

      const scale = 160; 
      
      const x1 = nx * Math.cos(rotation.z) - ny * Math.sin(rotation.z);
      const y1 = nx * Math.sin(rotation.z) + ny * Math.cos(rotation.z);
      
      const y2 = y1 * Math.cos(rotation.x) - nz * Math.sin(rotation.x);
      const z2 = y1 * Math.sin(rotation.x) + nz * Math.cos(rotation.x); 

      return {
        u: width / 2 + x1 * scale,
        v: height / 2 + 120 - z2 * scale, 
        depth: y2
      };
    };

    // 2. BUILD QUADS (with strict typing)
    // FIX: Typed as Quad[] instead of any[]
    const quads: Quad[] = [];
    
    // Grid helper
    const grid: (ProbabilityPoint3D | undefined)[][] = [];
    for (let i = 0; i < resolution; i++) {
      grid[i] = [];
      for (let j = 0; j < resolution; j++) {
        const index = i * resolution + j;
        if (data[index]) grid[i][j] = data[index];
      }
    }

    for (let i = 0; i < resolution - 1; i++) {
      for (let j = 0; j < resolution - 1; j++) {
        const p1 = grid[i][j];
        const p2 = grid[i + 1][j];
        const p3 = grid[i + 1][j + 1];
        const p4 = grid[i][j + 1];

        if (p1 && p2 && p3 && p4) {
          const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
          const relZ = (avgZ - zMin) / (zMax - zMin || 1);

          const proj1 = project(p1.x, p1.y, p1.z);
          const proj2 = project(p2.x, p2.y, p2.z);
          const proj3 = project(p3.x, p3.y, p3.z);
          const proj4 = project(p4.x, p4.y, p4.z);

          const avgDepth = (proj1.depth + proj2.depth + proj3.depth + proj4.depth) / 4;

          quads.push({
            points: [proj1, proj2, proj3, proj4],
            color: getColor(relZ),
            depth: avgDepth,
            stroke: `hsla(${ (1 - relZ) * 240 }, 50%, 40%, 0.5)`
          });
        }
      }
    }

    // 3. SORT & DRAW
    quads.sort((a, b) => a.depth - b.depth);

    quads.forEach(q => {
      ctx.beginPath();
      ctx.moveTo(q.points[0].u, q.points[0].v);
      ctx.lineTo(q.points[1].u, q.points[1].v);
      ctx.lineTo(q.points[2].u, q.points[2].v);
      ctx.lineTo(q.points[3].u, q.points[3].v);
      ctx.closePath();
      
      ctx.fillStyle = q.color;
      ctx.fill();

      ctx.strokeStyle = q.stroke;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // DRAW AXES
    const corners = [
      project(xMin, yMin, 0), 
      project(xMax, yMin, 0),
      project(xMax, yMax, 0), 
      project(xMin, yMax, 0)
    ];

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(corners[0].u, corners[0].v);
    ctx.lineTo(corners[1].u, corners[1].v);
    ctx.lineTo(corners[2].u, corners[2].v);
    ctx.lineTo(corners[3].u, corners[3].v);
    ctx.lineTo(corners[0].u, corners[0].v);
    ctx.stroke();

    // TICKS & LABELS
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // X Ticks
    for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        const val = xMin + t * (xMax - xMin);
        const ux = corners[0].u + t * (corners[1].u - corners[0].u);
        const vx = corners[0].v + t * (corners[1].v - corners[0].v);
        
        ctx.beginPath();
        ctx.moveTo(ux, vx);
        ctx.lineTo(ux, vx + 5); 
        ctx.stroke();
        ctx.fillText(val.toFixed(1), ux, vx + 15);
    }

    // Y Ticks
    for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        const val = yMin + t * (yMax - yMin);
        const uy = corners[0].u + t * (corners[3].u - corners[0].u);
        const vy = corners[0].v + t * (corners[3].v - corners[0].v);

        ctx.beginPath();
        ctx.moveTo(uy, vy);
        ctx.lineTo(uy - 5, vy);
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1), uy - 8, vy);
    }
    
    // Axis Titles
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    
    const midX = (corners[0].u + corners[1].u) / 2;
    const midY = (corners[0].v + corners[1].v) / 2;
    ctx.fillText("X Axis", midX, midY + 35);
    
    const midY_u = (corners[0].u + corners[3].u) / 2;
    const midY_v = (corners[0].v + corners[3].v) / 2;
    ctx.fillText("Y Axis", midY_u - 40, midY_v);

    ctx.textAlign = 'left';
    ctx.fillText(zLabel, 20, 30);

  }, [data, rotation, resolution, type, zLabel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotation(prev => ({
      z: prev.z - dx * 0.01,
      x: Math.max(0.1, Math.min(Math.PI / 2, prev.x + dy * 0.01))
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 w-full relative overflow-hidden">
       <div className="absolute top-4 right-4 text-xs text-slate-400 pointer-events-none bg-white/80 px-2 py-1 rounded">
          Drag to Rotate
       </div>
      <canvas 
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};