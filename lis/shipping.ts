export function calculateShipping(city:string, weightKg:number) {
  const base: Record<string,number> = { Bosaso: 4, Garowe: 7, Qardho: 6 };
  const perKg = city === "Garowe" ? 1.6 : 1.2;
  return Number(((base[city] ?? 8) + Math.max(weightKg - 1, 0) * perKg).toFixed(2));
}
