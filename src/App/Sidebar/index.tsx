import styles from "./styles.module.css";

const Sidebar = () => {
  return (
    <div className={styles.contaniner}>
      <h2>SIDEBAR....!!!</h2>
      <hr />
      <a className="active" href="#home">
        Home
      </a>
      <a href="#news">News</a>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
    </div>
  );
};

export default Sidebar;
