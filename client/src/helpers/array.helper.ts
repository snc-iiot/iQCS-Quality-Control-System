type GroupedItems<T> = Record<string, T[]>;

// Utility function to safely access nested properties
const getNestedValue = (obj: any, key: string): any => key.split(".").reduce((acc, part) => acc?.[part], obj);

// Group an array by a specified key (supports nested keys)
export const groupBy = <T>(array: T[], key: string): GroupedItems<T> => {
  return array.reduce((result, currentValue) => {
    const groupKey = getNestedValue(currentValue, key) ?? "None";
    (result[groupKey] = result[groupKey] || []).push(currentValue);
    return result;
  }, {} as GroupedItems<T>);
};

// Order an array by a specified key (supports nested keys and ordering direction)
export const orderArrayBy = <T>(array: T[], key: string, ordering: "ascending" | "descending" = "ascending"): T[] => {
  if (!array?.length) return [];

  const adjustedKey = key.startsWith("-") ? key.slice(1) : key;
  const sortOrder = key.startsWith("-") ? "descending" : ordering;

  return [...array].sort((a, b) => {
    const keyA = getNestedValue(a, adjustedKey);
    const keyB = getNestedValue(b, adjustedKey);

    if (keyA < keyB) return sortOrder === "ascending" ? -1 : 1;
    if (keyA > keyB) return sortOrder === "ascending" ? 1 : -1;
    return 0;
  });
};

// Check if an array contains duplicate values
export const checkDuplicates = (array: any[]): boolean => new Set(array).size !== array.length;

// Find the string with the most characters in an array of strings
export const findStringWithMostCharacters = (strings: string[]): string => {
  if (!strings?.length) return "";
  return strings.reduce((longest, current) => (current.length > longest.length ? current : longest));
};

// Check if two arrays contain the same elements (ignores order)
export const checkIfArraysHaveSameElements = (arr1: any[] | null, arr2: any[] | null): boolean => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  return arr1.every((element) => arr2.includes(element));
};

// Group an array by a specific field (key of the object)
export const groupByField = <T>(array: T[], field: keyof T): GroupedItems<T> =>
  array.reduce((grouped, item) => {
    const key = String(item[field]);
    grouped[key] = (grouped[key] || []).concat(item);
    return grouped;
  }, {} as GroupedItems<T>);

// Sort an array by a specific field
export const sortByField = <T>(array: T[], field: keyof T): T[] =>
  [...array].sort((a, b) => (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0));

// Order grouped data by a specific field
export const orderGroupedDataByField = <T>(groupedData: GroupedItems<T>, orderBy: keyof T): GroupedItems<T> => {
  Object.keys(groupedData).forEach((key) => {
    groupedData[key] = groupedData[key].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return -1;
      if (a[orderBy] > b[orderBy]) return 1;
      return 0;
    });
  });
  return groupedData;
};
