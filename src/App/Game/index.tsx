import { useState, useEffect } from "react";

import Display from "./Display";
import Score from "./Score";

import styles from "./styles.module.css";

const Game = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const obtenerItems = async () => {
      const response = await fetch('./data.json');
      const data = await response.json();
      setData(data.tools);
    };

    obtenerItems();
  }, []);

  return (
    <div className={styles.contaniner}>
      <div className={styles.display}>
        <Display data={data} />
      </div>
      <div className={styles.score}>
        <Score />
      </div>
    </div>
  );
};

export default Game;
