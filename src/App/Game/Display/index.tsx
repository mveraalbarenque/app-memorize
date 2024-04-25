import React from "react";

import Cards from "./Cards";

import styles from "./styles.module.css";

interface Props {
  data: [];
}

const Display: React.FC<Props> = ({ data }) => {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>DISPLAY...</h1>
      </div>
      <div className={styles.body}>
        <Cards data={data}/>
      </div>

      <div className={styles.footer}>INFOR PARTIDA ACTUAL</div>
    </div>
  );
};

export default Display;
