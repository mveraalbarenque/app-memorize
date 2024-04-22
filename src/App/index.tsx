import Sidebar from "./Sidebar";
import Main from "./Main";
import Profile from "./Profile";

import styles from "./styles.module.css";

const App = () => {
  return (
    <div className={styles.contaniner}>
      <Sidebar />
      <Main />
      <Profile />
    </div>
  );
};

export default App;
