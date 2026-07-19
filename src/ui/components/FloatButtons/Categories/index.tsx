import styles from '../styles.module.css';

interface Props {
  onOpenCategories: () => void;
}

const Categories = (props: Props) => {
  const { onOpenCategories } = props;

  const propsBntCategories = {
    className: styles.fab,
    onClick: onOpenCategories,
    title: 'Categorías',
  };

  const propsImgCategorie = {
    src: '/icons/categories.svg',
    alt: 'Categorías',
  };

  return (
    <button {...propsBntCategories}>
      <span className={styles.fabIcon}>
        <img {...propsImgCategorie} />
      </span>
    </button>
  );
};

export default Categories;
