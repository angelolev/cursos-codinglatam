// Generic search filter function
export function filterBySearch<T extends { title: string }>(
  items: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) return items;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter((item) =>
    item.title.toLowerCase().includes(lowerSearchTerm)
  );
}

// Free/Premium filter function for items with isFree property
export function filterByFreePremium<T extends { isFree: boolean }>(
  items: T[],
  filterValue: string
): T[] {
  if (filterValue === "all") return items;
  if (filterValue === "free") return items.filter((item) => item.isFree);
  if (filterValue === "premium") return items.filter((item) => !item.isFree);
  return items;
}

// Course availability filter function
export function filterByAvailability<T extends { available: boolean }>(
  items: T[],
  filterValue: string
): T[] {
  if (filterValue === "all") return items;
  if (filterValue === "available") return items.filter((item) => item.available);
  if (filterValue === "coming_soon") return items.filter((item) => !item.available);
  return items;
}

// Combined filter function that applies search and then a custom filter
export function applyFilters<T>(
  items: T[],
  searchTerm: string,
  filterValue: string,
  searchFilter: (items: T[], searchTerm: string) => T[],
  customFilter: (items: T[], filterValue: string) => T[]
): T[] {
  const searchFiltered = searchFilter(items, searchTerm);
  return customFilter(searchFiltered, filterValue);
}