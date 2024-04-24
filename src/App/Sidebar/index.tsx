import styles from "./styles.module.css";

const Sidebar = () => {
  const handleClick = (e) => {
    e.preventDefault();
    console.log(e.target);

  }

  return (
    <div className={styles.contaniner}>
      <h2>SIDEBAR....!!!</h2>
      <hr />
      <a href="#home" onClick={handleClick}>Home</a>
      <a className={styles.active} href="#news" onClick={handleClick}>
        News
      </a>
      <a href="#contact" onClick={handleClick}>Contact</a>
      <a href="#about" onClick={handleClick}>About</a>
    </div>
  );
};

export default Sidebar;
