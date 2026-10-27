let ctx: AudioContext | null = null;

// Browsers only allow audio after a tap, so call this from a click handler first
export function unlockSound(): void {
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
  } catch {}
}

export function beep(freq = 880, ms = 80, volume = 0.15): void {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000);
  } catch {}
}
