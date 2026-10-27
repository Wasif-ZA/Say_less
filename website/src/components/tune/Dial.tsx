"use client";

import { useRef } from "react";
import { BANDS } from "@/lib/tune/engine";
import type { Spectrum } from "@/lib/tune/types";

const CX = 100;
const CY = 100;
const R = 90;
const BAND_FILLS = ["#ff5c5c", "#ff8a3d", "#ffd27a"];

interface Needle {
  value: number;
  label?: string;
  color?: string;
}

interface DialProps {
  spectrum: Spectrum;
  target?: number;
  needles?: Needle[];
  onChange?: (value: number) => void;
}

function point(value: number, radius: number) {
  const a = Math.PI * (1 - value / 100);
  return { x: CX + radius * Math.cos(a), y: CY - radius * Math.sin(a) };
}

function wedge(from: number, to: number) {
  const a = point(Math.max(0, from), R);
  const b = point(Math.min(100, to), R);
  return `M ${CX} ${CY} L ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y} Z`;
}

export function Dial({ spectrum, target, needles = [], onChange }: DialProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  function valueAt(clientX: number, clientY: number) {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return null;
    const x = ((clientX - box.left) / box.width) * 200 - CX;
    const y = CY - ((clientY - box.top) / box.height) * 110;
    const angle = y < 0 ? (x < 0 ? Math.PI : 0) : Math.atan2(y, x);
    return Math.round(100 * (1 - angle / Math.PI));
  }

  function handle(e: React.PointerEvent<SVGSVGElement>) {
    if (!onChange || (e.type === "pointermove" && e.buttons === 0)) return;
    const v = valueAt(e.clientX, e.clientY);
    if (v !== null) onChange(v);
  }

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 200 110"
        className={`w-full ${onChange ? "touch-none cursor-pointer" : ""}`}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handle(e); }}
        onPointerMove={handle}
      >
        <path d={wedge(0, 100)} fill="#fbf7ec" stroke="#0b0d12" strokeWidth="2.5" />
        {target !== undefined &&
          [...BANDS].reverse().map((band, i) => (
            <path
              key={band.points}
              d={wedge(target - band.halfWidth, target + band.halfWidth)}
              fill={BAND_FILLS[BANDS.length - 1 - i]}
              stroke="#0b0d12"
              strokeWidth="1"
            />
          ))}
        {target !== undefined && (
          <text x={point(target, R - 10).x} y={point(target, R - 10).y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0b0d12">4</text>
        )}
        {needles.map((n, i) => {
          const tip = point(n.value, R - 4);
          const tag = point(n.value, R + 2);
          return (
            <g key={i}>
              <line x1={CX} y1={CY} x2={tip.x} y2={tip.y} stroke={n.color ?? "#0b0d12"} strokeWidth="3" strokeLinecap="round" />
              {n.label && (
                <text x={tag.x} y={Math.max(8, tag.y - 2)} textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r="7" fill="#0b0d12" />
      </svg>
      <div className="flex justify-between gap-4 mt-2 text-[15px] font-bold">
        <span className="text-left">← {spectrum.left}</span>
        <span className="text-right">{spectrum.right} →</span>
      </div>
      {onChange && needles[0] && (
        <input
          type="range"
          min={0}
          max={100}
          value={needles[0].value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`Dial from ${spectrum.left} to ${spectrum.right}`}
          className="w-full mt-4 accent-[#ff8a3d]"
        />
      )}
    </div>
  );
}
