"use client";

import { useEffect, useState } from "react";

export interface NavTarget {
  label: string;
  onClick: () => void;
  confirm?: boolean;
}

const PILL = "h-11 min-w-11 px-3 rounded-full border-[2.5px] border-ink bg-paper text-ink font-bold text-[15px] flex items-center justify-center gap-1.5 shadow-[3px_3px_0_#0b0d12] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#0b0d12] transition-transform";

function NavButton({ target, icon, side }: { target: NavTarget; icon: string; side: "left" | "right" }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  function handle() {
    if (target.confirm && !armed) return setArmed(true);
    setArmed(false);
    target.onClick();
  }

  return (
    <button
      onClick={handle}
      aria-label={target.label}
      className={`${PILL} pointer-events-auto ${armed ? "bg-hot!" : ""} ${side === "right" ? "ml-auto" : ""}`}
    >
      <span aria-hidden className="text-[18px] leading-none">{icon}</span>
      {armed ? <span>Sure? Tap again</span> : side === "right" ? <span>{target.label}</span> : null}
    </button>
  );
}

export function NavBar({ back, home }: { back?: NavTarget; home?: NavTarget }) {
  if (!back && !home) return null;
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{ paddingTop: "max(10px, env(safe-area-inset-top))" }}
    >
      <div className="max-w-lg mx-auto px-4 flex items-center">
        {back && <NavButton target={back} icon="←" side="left" />}
        {home && <NavButton target={home} icon="⌂" side="right" />}
      </div>
    </nav>
  );
}
