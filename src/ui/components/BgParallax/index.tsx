import { useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const SPEED = 0.04;

const BgParallax = () => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);

  const animate = useCallback(() => {
    xRef.current += (targetXRef.current - xRef.current) * SPEED;
    yRef.current += (targetYRef.current - yRef.current) * SPEED;

    if (ref.current)
      ref.current.style.transform = `translate(${xRef.current}px, ${yRef.current}px)`;

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 10;
      const cy = window.innerHeight / 10;
      targetXRef.current = ((e.clientX - cx) / cx) * -20;
      targetYRef.current = ((e.clientY - cy) / cy) * -20;
    };

    raf.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouse, { passive: true });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [animate]);

  return <div ref={ref} className={styles.bg} />;
};

export default BgParallax;
