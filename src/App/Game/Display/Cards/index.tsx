import { useState, useEffect } from "react";

import Card from "./Card";

import styles from "./styles.module.css";


interface Props {
  data: [];
}

const Cards: React.FC<Props> = ({ data }) => {
  const [columns, setColumns] = useState<number>(0);

  useEffect(() => {
    const total = Math.ceil(Math.sqrt(data.length * 2));
    setColumns(() => total);
  }, [data]);

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
      <div {...propsWrapper}>
        {data.map((obj) => (
          <Card obj={obj} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
