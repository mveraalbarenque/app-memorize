export interface Level {
  rows: number;
  cols: number;
  pairs: number;
  label: string;
}

export const LEVELS: Level[] = [
  { rows: 2, cols: 2, pairs: 2, label: 'N1' },
  { rows: 2, cols: 3, pairs: 3, label: 'N2' },
  { rows: 2, cols: 4, pairs: 4, label: 'N3' },
  { rows: 3, cols: 4, pairs: 6, label: 'N4' },
  { rows: 4, cols: 4, pairs: 8, label: 'N5' },
  { rows: 4, cols: 5, pairs: 10, label: 'N6' },
];
