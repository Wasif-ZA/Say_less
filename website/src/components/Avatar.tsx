import Image from "next/image";

const ANIMALS = [
  "fox", "rabbit", "badger", "deer", "hedgehog", "otter", "lynx", "red-panda", "squirrel", "hare",
  "lamb", "white-goat", "boar", "macaque", "peafowl", "tortoise", "snow-leopard", "yak", "white-horse", "pheasant",
];

export function animalSrc(index: number) {
  return `/animals/${ANIMALS[Math.max(index, 0) % ANIMALS.length]}.webp`;
}

export function Avatar({ index, className = "w-10 h-10" }: { index: number; className?: string }) {
  return (
    <div className={`${className} shrink-0 rounded-full bg-paper-2 border border-hairline overflow-hidden flex items-center justify-center`}>
      <Image src={animalSrc(index)} alt="" width={96} height={96} className="w-[88%] h-[88%] object-contain" />
    </div>
  );
}
