import Display from "./Display";
import Score from "./Score";

import styles from "./styles.module.css";

const Main = () => {
  return (
    <div className={styles.contaniner}>
      <div className={styles.display}>
        <Display />
      </div>
      <div className={styles.score}>
        <Score />
      </div>
    </div>
  );
};

export default Main;
