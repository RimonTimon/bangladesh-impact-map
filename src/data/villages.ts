// Placeholder gram (village) data per upazila.
// Replace names, tree counts, dates and info with the NGO's real records.

export type Gram = {
  name: string;
  trees: number;
  date: string;
  time: string;
  info: string;
  // dot position on the upazila mini-map, in percent of the upazila's bounding box
  x: number;
  y: number;
};

const INFO =
  "Community-led plantation drive with local volunteers and school students. Saplings are native fruit and timber species, cared for by a village green committee.";

export function gramsFor(upazila: string, totalTrees: number): Gram[] {
  const names = [
    `${upazila} Sadar Gram`,
    `Uttar ${upazila}`,
    `Dakshin ${upazila}`,
    `Char ${upazila}`,
  ];
  const shares = [0.32, 0.27, 0.23, 0.18];
  const dates = [
    ["12 March 2026", "9:30 AM"],
    ["28 February 2026", "10:00 AM"],
    ["15 January 2026", "8:45 AM"],
    ["3 December 2025", "11:15 AM"],
  ];
  const spots: [number, number][] = [
    [42, 30],
    [62, 48],
    [35, 62],
    [55, 78],
  ];
  return names.map((name, i) => ({
    name,
    trees: Math.round(totalTrees * shares[i]),
    date: dates[i][0],
    time: dates[i][1],
    info: INFO,
    x: spots[i][0],
    y: spots[i][1],
  }));
}
