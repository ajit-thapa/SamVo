import { useState, useEffect, useRef } from 'react';

export default function BreathingTimer() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev === 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return 7;
          }
          if (phase === 'hold') {
            setPhase('exhale');
            return 8;
          }
          if (phase === 'exhale') {
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase]);

  return (
    <div className="text-center p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold">Resonant Breathing</h2>
      <p className="text-gray-500 text-sm mb-4">Inhale 4s → Hold 7s → Exhale 8s</p>
      <div className="text-6xl font-mono my-6 text-indigo-600">{seconds}</div>
      <div className="text-xl capitalize font-semibold text-indigo-600">{phase}</div>
      <div className="flex gap-4 justify-center mt-6">
        <button onClick={() => setIsActive(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Start</button>
        <button onClick={() => setIsActive(false)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Pause</button>
        <button onClick={() => { setIsActive(false); setPhase('inhale'); setSeconds(4); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reset</button>
      </div>
    </div>
  );
}
