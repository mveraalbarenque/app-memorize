import { ImageData } from '@/utils/interfaces';

const urlImageData = './data.json';

export const getDataImagenes = async (obj: string): Promise<ImageData[]> => {
  const response = await fetch(urlImageData);
  const data = await response.json();

  if (Array.isArray(data[obj])) return data[obj];
  else {
    throw new Error(`No se encontró el grupo de imágenes para "${obj}"`);
  }
};
