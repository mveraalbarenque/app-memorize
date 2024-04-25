export const getDataImagenes = async (obj: string): Promise<[]> => {
  const response = await fetch("./data.json");
  const data = await response.json();
  return data[obj];
};
