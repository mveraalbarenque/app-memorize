export interface Level {
  rows: number;
  cols: number;
  pairs: number;
  label: string;
}

export const LEVELS: Level[] = [
  { rows: 2, cols: 2, pairs: 2, label: '1' },
  { rows: 2, cols: 3, pairs: 3, label: '2' },
  { rows: 2, cols: 4, pairs: 4, label: '3' },
  { rows: 3, cols: 4, pairs: 6, label: '4' },
  { rows: 4, cols: 4, pairs: 8, label: '5' },
  { rows: 4, cols: 5, pairs: 10, label: '6' },
];

export const DEFAULT_NAMES = ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'];
