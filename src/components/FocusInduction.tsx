import { useState, useEffect } from 'react';

export default function FocusInduction({ target }: { target: 10 | 12 }) {
  const [count, setCount] = useState(target === 10 ? 10 : 12);
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!active || count === 0) {
      if (count === 0 && active) {
        setCompleted(true);
        setActive(false);
      }
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 2000);
    return () => clearTimeout(timer);
  }, [active, count]);

  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-2xl font-bold">Focus {target} Induction</h2>
      <p className="text-gray-500 text-sm mb-4">On each exhale, say the number silently</p>
      {active && count > 0 ? (
        <div className="text-5xl font-mono my-8 text-purple-600">{count}</div>
      ) : (
        <div className="my-8 text-gray-500">Ready to begin</div>
      )}
      <button
        onClick={() => {
          setActive(true);
          setCount(target === 10 ? 10 : 12);
          setCompleted(false);
        }}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Start
      </button>
      {completed && (
        <p className="mt-4 text-green-600 font-semibold">✅ You are now at Focus {target}. Mind awake, body asleep.</p>
      )}
    </div>
  );
}
