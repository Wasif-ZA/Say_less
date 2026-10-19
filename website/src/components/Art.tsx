import Image from "next/image";

export function Art({ name, className = "w-16 h-16" }: { name: string; className?: string }) {
  const src = `/art/${name}.${name.startsWith("emote-") ? "svg" : "webp"}`;
  return <Image src={src} alt="" width={192} height={192} unoptimized className={`${className} object-contain select-none`} draggable={false} />;
}
