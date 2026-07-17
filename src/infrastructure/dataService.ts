import type { ImageData } from '@/core/types';

const urlImageData = './data.json';

let dataCache: Record<string, ImageData[]> | null = null;

const getData = async (): Promise<Record<string, ImageData[]>> => {
  if (dataCache) return dataCache;
  const res = await fetch(urlImageData);
  dataCache = (await res.json()) as Record<string, ImageData[]>;
  return dataCache;
};

export const fetchCategories = async (): Promise<string[]> => {
  const data = await getData();
  return Object.keys(data);
};

export const fetchCardsByCategory = async (
  category: string,
  count: number,
): Promise<ImageData[]> => {
  const data = await getData();
  if (!Array.isArray(data[category]))
    throw new Error(`No se encontró el grupo de imágenes para "${category}"`);
  return data[category].slice(0, count).map((item: ImageData) => ({ ...item }));
};

export const fetchAllImages = async (): Promise<string[]> => {
  const data = await getData();
  const imgs: string[] = [];
  for (const cat of Object.keys(data))
    if (Array.isArray(data[cat]))
      for (const item of data[cat]) imgs.push(item.img);
  return imgs;
};
