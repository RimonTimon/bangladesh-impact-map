import data from '@/data/upazilas.json';
export type Area = { name: string; d: string; cx: number; cy: number; trees: number };
export const highlighted = ['Kurigram','Gaibandha','Sunamganj','Satkhira','Bhola',"Cox's Bazar",'Bandarban','Jamalpur'];
const source = data as Record<string, { w: number; h: number; upazilas: Area[] }>;
export function districtFor(name: string) {
  const district = source[name];
  if (!district) return undefined;
  return { ...district, upazilas: district.upazilas.map((area, index) => ({ ...area, trees: index % 4 === 2 ? 0 : area.trees })) };
}
export const allAreas = highlighted.flatMap(name => districtFor(name)?.upazilas ?? []);
export const totalTrees = allAreas.reduce((sum, area) => sum + area.trees, 0);
