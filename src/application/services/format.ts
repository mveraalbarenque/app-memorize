export const formatTime = (cs: number): string => {
  const m = Math.floor(cs / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const cent = cs % 100;
  return `${m}:${s.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
};
