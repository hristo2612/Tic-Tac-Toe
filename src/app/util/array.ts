export const getEmptyArray = (size: number, fillValue: any): any[] => [
  ...Array(size).fill(fillValue),
];
