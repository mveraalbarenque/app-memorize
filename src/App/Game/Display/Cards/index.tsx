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
    const total = Math.ceil(Math.sqrt(data.length*2));
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
      const propsImagen = {
        className: styles.card,
        key: id,
        src: img,
        alt: name,
      };
      return (
        <div>
          {/* <div className={styles.front}>
          <img {...propsImagenFront} />
          </div> */}
          <div className={styles.back}>
            <img {...propsImagen} />
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

  return (
    <div className={styles.cards}>
      <div {...propsWrapper}>{renderCard()}</div>
    </div>
  );
};

export default Cards;
