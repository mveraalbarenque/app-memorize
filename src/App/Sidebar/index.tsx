import styles from "./styles.module.css";

const Sidebar = () => {
  return (
    <div className={styles.contaniner}>
      <h2>SIDEBAR....!!!</h2>
      <hr />
      <a href="#home">Home</a>
      <a className={styles.active} href="#news">
        News
      </a>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
    </div>
  );
};

export default Sidebar;
