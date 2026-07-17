import type { ImageData } from '@/core/types';

export interface DataService {
  fetchCategories(): Promise<string[]>;
  fetchCardsByCategory(category: string, count: number): Promise<ImageData[]>;
  fetchAllImages(): Promise<string[]>;
}
