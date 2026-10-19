import Image from "next/image";

export function Art({ name, className = "w-16 h-16" }: { name: string; className?: string }) {
  return <Image src={`/art/${name}.svg`} alt="" width={120} height={120} unoptimized className={`${className} select-none`} draggable={false} />;
}
