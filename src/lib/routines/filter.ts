export function filterRoutines<T extends { name: string }>(routines: T[], search: string): T[] {
  if (!search.trim()) return routines
  const q = search.trim().toLowerCase()
  return routines.filter(r => r.name.toLowerCase().includes(q))
}
