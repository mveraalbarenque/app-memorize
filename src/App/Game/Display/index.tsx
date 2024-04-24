import React from "react";
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

const Display: React.FC<Props> = ({ data }) => {
  const [columns, setColumns] = useState<number>(0);

  useEffect(() => {
    const total = Math.ceil(Math.sqrt(data.length * 2))
    setColumns(() => total);
  }, [data]);

  const renderCard = () => {
    return data.map((obj) => {
      const { id, name, img } = obj;
      const propsImagen = {
        className: styles.card,
        key: id,
        src: img,
        alt: name,
      };
      return <img {...propsImagen} />;
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>DISPLAY...</h1>
      </div>
      <div className={styles.body}>
        <div className={styles.cards}>
          <div {...propsWrapper}>{renderCard()}</div>
        </div>
      </div>

      <div className={styles.footer}>INFOR PARTIDA ACTUAL</div>
    </div>
  );
};

export default Display;
