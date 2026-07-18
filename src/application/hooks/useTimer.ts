import { useEffect, useRef, useState } from 'react';

export const useTimer = (running: boolean) => {
  const [cs, setCs] = useState(0);
  const startRef = useRef(0);
  const accruedRef = useRef(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (!running) {
      accruedRef.current += Math.floor((Date.now() - startRef.current) / 10);
      clearInterval(intervalRef.current);
      return;
    }

    startRef.current = Date.now();
    const tick = () => {
      setCs(
        accruedRef.current + Math.floor((Date.now() - startRef.current) / 10)
      );
    };
    tick();
    intervalRef.current = window.setInterval(tick, 50);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const resetTimer = () => {
    accruedRef.current = 0;
    setCs(0);
  };

  return { cs, resetTimer };
};
