import { useRef, useEffect, useState } from 'react';

export default function RebalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [radius, setRadius] = useState(20);
  const maxRadius = 70;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (radius > 50) {
      ctx.beginPath();
      ctx.arc(x, y, radius - 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,200,0.4)';
      ctx.fill();
    }
  }, [radius]);

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-2xl font-bold">REBAL (Energy Balloon)</h2>
      <p className="text-gray-500 text-sm mb-2">Inhale to contract, exhale to expand & float</p>
      <canvas
        ref={canvasRef}
        width="300"
        height="150"
        className="mx-auto border rounded my-4 bg-gray-50"
      />
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setRadius(r => Math.max(15, r - 5))}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          Inhale (shrink)
        </button>
        <button
          onClick={() => setRadius(r => Math.min(maxRadius, r + 8))}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Exhale (expand)
        </button>
        <button
          onClick={() => setRadius(20)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3">Protective floating balloon – let it carry you upward</p>
    </div>
  );
}
