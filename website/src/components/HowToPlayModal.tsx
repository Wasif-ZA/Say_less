"use client";

const steps = [
  { emoji: "🎭", title: "Get your roles", text: "Everyone sees a secret word — except the Imposter." },
  { emoji: "🗣️", title: "Describe it", text: "Give vague hints about the word. Don't be too obvious!" },
  { emoji: "👀", title: "Spot the fake", text: "The Imposter is making it up. Listen carefully." },
  { emoji: "🗳️", title: "Vote them out", text: "Agree as a group on who to eliminate." },
  { emoji: "🏆", title: "Win or lose", text: "Catch the Imposter and the town wins!" },
];

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative bg-[#18181f] rounded-t-[32px] p-6 pb-10 w-full max-w-lg max-h-[85dvh] overflow-y-auto scrollbar-hide animate-slideUpIn z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <h2 className="font-display text-3xl font-bold text-white mb-6">How to Play</h2>

        <div className="flex flex-col gap-5">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-start gap-4 animate-fadeInUp stagger-${i + 1}`}>
              <div className="w-11 h-11 rounded-2xl bg-white/8 flex items-center justify-center text-2xl shrink-0">
                {s.emoji}
              </div>
              <div className="pt-0.5">
                <p className="font-display font-bold text-white text-[17px]">{s.title}</p>
                <p className="font-body text-white/50 text-sm mt-0.5 leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn-big btn-white text-xl mt-8" style={{ height: 60 }}>
          Got it
        </button>
      </div>
    </div>
  );
}
