"use client";

import { Art } from "@/components/Art";
import { ScreenWrapper } from "../ScreenWrapper";

interface PassCoverProps {
  name: string;
  role: string;
  hint: string;
  onReady: () => void;
}

export function PassCover({ name, role, hint, onReady }: PassCoverProps) {
  return (
    <ScreenWrapper bgClassName="bg-ink">
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 animate-fadeInUp">
        <span className="clip-label">{role}</span>
        <p className="text-white/75 text-lg mt-2">Pass the phone to</p>
        <h1 className="font-poster text-[56px] uppercase leading-none px-4 break-words">{name}</h1>
        <Art name="sticker-shh" className="w-32 h-32 my-4" />
        <p className="text-white/75 text-base max-w-[280px]">{hint}</p>
      </div>
      <button onClick={onReady} className="btn-big btn-white text-xl mt-6">
        I&apos;M {name.toUpperCase()}, SHOW ME
      </button>
    </ScreenWrapper>
  );
}
