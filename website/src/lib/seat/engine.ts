export const MIN_SEAT_PLAYERS = 3;
export const ROUND_OPTIONS = [5, 8, 10] as const;

export const PROMPTS: string[] = [
  "cry at a kids' movie",
  "forget their own birthday",
  "survive a zombie apocalypse",
  "become famous by accident",
  "text back in under a minute",
  "get lost with GPS on",
  "talk their way out of a speeding ticket",
  "eat an entire pizza alone",
  "fall asleep at a party",
  "adopt a pet on impulse",
  "win a cooking competition",
  "be late to their own wedding",
  "sing loudly in the car",
  "start a business and make it work",
  "laugh at the wrong moment",
  "keep a secret for ten years",
  "trip over nothing",
  "binge a whole series in one day",
  "become a millionaire",
  "talk to a stranger on a long flight",
  "pack way too much for a weekend trip",
  "get a tattoo on a whim",
  "have 3,000 unread emails",
  "dance on a table at a party",
  "leave a group chat on read for days",
  "write a bestselling book",
  "cook dinner and set off the smoke alarm",
  "win a pub quiz single-handedly",
  "get stuck in an escape room",
  "give the best gift",
  "take 200 photos of one meal",
  "miss their stop on the train",
  "become a cat person overnight",
  "go viral on the internet",
  "say yes to every invitation",
  "lose their phone while holding it",
  "make friends with the neighbours",
  "give a speech without notes",
  "name a pet something ridiculous",
  "run a marathon without training",
  "stay calm in an emergency",
  "burst into song at work",
  "buy something they do not need",
  "start a tiny fight over a board game",
  "move overseas on a whim",
  "get the group out of a bad plan",
  "be the first to arrive",
  "tell the same story twice in one night",
  "laugh until they cannot breathe",
  "wear pyjamas to the shops",
  "forget a name the second they hear it",
  "turn up in the wrong costume",
  "be a great teacher",
  "be cheerful at 6am",
  "end up on a reality show",
  "keep a plant alive",
  "lock themselves out of the house",
  "make the group chat go quiet",
  "become the boss one day",
  "get emotional at a wedding",
];

export function tally(votes: Record<string, string>, playerIds: string[]): { counts: Record<string, number>; top: string[] } {
  const counts: Record<string, number> = Object.fromEntries(playerIds.map((id) => [id, 0]));
  for (const target of Object.values(votes)) if (target in counts) counts[target]++;
  const max = Math.max(0, ...Object.values(counts));
  return { counts, top: max === 0 ? [] : playerIds.filter((id) => counts[id] === max) };
}

export function canAccuse(votes: Record<string, string>, top: string[]): boolean {
  return top.length === 1 && Object.entries(votes).some(([voter, target]) => target === top[0] && voter !== top[0]);
}

export function pickPrompt(used: number[], randomFn: () => number = Math.random): number {
  let pool = PROMPTS.map((_, i) => i).filter((i) => !used.includes(i));
  if (pool.length === 0) pool = PROMPTS.map((_, i) => i);
  return pool[Math.floor(randomFn() * pool.length)];
}
