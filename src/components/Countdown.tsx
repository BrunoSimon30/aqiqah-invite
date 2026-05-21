import { useEffect, useState } from "react";

export function Countdown({ target }: { target: Date }) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cells = [
    { label: "Days", value: t.d },
    { label: "Hours", value: t.h },
    { label: "Minutes", value: t.m },
    { label: "Seconds", value: t.s },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur px-2 sm:px-4 py-4 sm:py-6 text-center shadow-soft"
        >
          <div className="font-display text-3xl sm:text-5xl text-gold tabular-nums">
            {String(c.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-muted-foreground">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
