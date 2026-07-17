export interface ImageData {
  id: number;
  name: string;
  img: string;
}

export interface PlayerConfig {
  name: string;
}

export interface LevelResult {
  level: number;
  label: string;
  time: string;
  attempts: number;
  matchedPairs: number;
}

export interface PlayerResult {
  name: string;
  levels: LevelResult[];
  totalTime: string;
  totalAttempts: number;
}
