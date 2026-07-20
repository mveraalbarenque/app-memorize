import { memo, useMemo } from 'react';

import styles from './styles.module.css';

interface Piece {
  img: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const PIECES = MOBILE ? 100 : 150;

interface Props {
  images: string[];
}

const Confetti = memo((props: Props) => {
  const { images } = props;

  const pieces = useMemo<Piece[]>(() => {
    if (!images.length) return [];
    return Array.from({ length: PIECES }, () => ({
      img: images[Math.floor(Math.random() * images.length)],
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.2 + Math.random() * 2,
      size: 12 + Math.random() * 24,
      rotate: Math.random() * 360,
    }));
  }, [images]);

  const elements = useMemo(
    () =>
      pieces.map((p, i) => {
        const propsPiece = {
          className: styles.piece,
          style: {
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundImage: `url(${p.img})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            rotate: `${p.rotate}deg`,
          },
        };

        return <div key={i} {...propsPiece} />;
      }),
    [pieces]
  );

  return <div className={styles.confetti}>{elements}</div>;
});

export default Confetti;
