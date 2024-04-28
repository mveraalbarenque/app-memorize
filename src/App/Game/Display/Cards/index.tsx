import { useState, useEffect } from "react";

import styles from "./styles.module.css";

interface Card {
  id: number;
  name: string;
  img: string;
}

interface Props {
  data: Card[];
}

const Cards: React.FC<Props> = ({ data }) => {
  const [columns, setColumns] = useState<number>(0);

  useEffect(() => {
    const total = Math.ceil(Math.sqrt(data.length * 2));
    setColumns(() => total);
  }, [data]);

  const renderCard = () => {
    return data.map((obj) => {
      const { id, name, img } = obj;
      const propsImagenFront = {
        className: styles.card,
        key: id,
        src: "/aws.svg",
        alt: name,
      };
      const propsImagenBack = {
        className: styles.card,
        key: id,
        src: img,
        alt: name,
      };
      return (
        <div className={styles.cardBox}>
          <div className={styles.card}>
          <div className={styles.front}>
            <img {...propsImagenFront} />
          </div>
          <div className={styles.back}>
            <img {...propsImagenBack} />
          </div>
          </div>
        </div>
      );
    });
  };

  const propsWrapper = {
    style: {
      display: "grid",
      gridTemplateRows: `repeat(${columns}, auto)`,
      gridGap: "8px",
      gridAutoFlow: "column",
    },
  };

  const propsImagenFront = {
    // className: styles.card,
    key: 1,
    src: "/aws.svg",
    alt: "aws",
  };
  const propsImagenBack = {
    // className: styles.card,
    key: 1,
    src: "/reactjs.svg",
    alt: "react",
  };

  return (
    <div className={styles.cards}>
      <div {...propsWrapper}>{renderCard()}</div>
{/*       
      <div {...propsWrapper}>
        <div className={styles.cardBox}>
          <div className={styles.card}>
          <div className={styles.front}>
            <img {...propsImagenFront} />
          </div>
          <div className={styles.back}>
            <img {...propsImagenBack} />
          </div>
          </div>
        </div>
      </div>
       */}
    </div>
  );
};

export default Cards;
