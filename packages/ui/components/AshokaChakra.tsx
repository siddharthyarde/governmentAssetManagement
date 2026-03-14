import React from "react";

type AshokaChakraProps = {
  size?: number;
  stroke?: string;
};

export function AshokaChakra({ size = 36, stroke = "#1A3A6B" }: AshokaChakraProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.88;
  const rimWidth = size * 0.07;
  const hubR = size * 0.1;
  const spokes = 24;

  const spokeLines = Array.from({ length: spokes }).map((_, i) => {
    const angle = (i * 360) / spokes;
    const rad = (angle * Math.PI) / 180;
    const x1 = cx + hubR * Math.cos(rad);
    const y1 = cy + hubR * Math.sin(rad);
    const x2 = cx + (r - rimWidth / 2) * Math.cos(rad);
    const y2 = cy + (r - rimWidth / 2) * Math.sin(rad);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={size * 0.012} />;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth={rimWidth} />
      <circle cx={cx} cy={cy} r={r - rimWidth} fill="white" />
      {spokeLines}
      <circle cx={cx} cy={cy} r={hubR} fill="none" stroke={stroke} strokeWidth={size * 0.018} />
    </svg>
  );
}
