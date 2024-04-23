import styles from "./styles.module.css";

const LISTADO = [2, 2, 4, 4, 1, 1, 3, 3];
const numColumns = Math.ceil(Math.sqrt(LISTADO.length));

const Display = () => {
    const renderCard = () => {
        return LISTADO.map((item) => {
            return <div className={styles.card}>{"CARTA "+ item}</div>;
        })
    }
  const propsCards = {
    className: styles.cards,
    columnas: numColumns,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>DISPLAY...</h1>
      </div>
      <div className={styles.body}>
        <div {...propsCards}>
            {renderCard()}
        </div>
      </div>

      <div className={styles.footer}>INFOR PARTIDA ACTUAL</div>
    </div>
  );
};

export default Display;
