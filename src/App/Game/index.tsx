import { useState, useEffect } from "react";

import Display from "./Display";
import Score from "./Score";

import { getDataImagenes } from "../../services/fetch/imagenes";

import styles from "./styles.module.css";

const Game = () => {
  const [data, setData] = useState<[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataFetch = await getDataImagenes("tools");
        setData(dataFetch);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getData();
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
