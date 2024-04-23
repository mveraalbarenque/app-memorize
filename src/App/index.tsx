import Sidebar from "./Sidebar";
import Game from "./Game";

import styles from "./styles.module.css";

const App = () => {
  return (
    <div className={styles.container}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.game}>
          <Game />
      </div>
    </div>
  );
};

export default App;
