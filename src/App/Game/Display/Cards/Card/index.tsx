interface Card {
    obj: {
        id: number,
        name: string,
        img: string,
    }
}

import styles from "./styles.module.css";

const Card : React.FC<Card> = ({obj})  => {
    const { id, name, img } = obj;
    const propsImagenFront = {
      key: id,
      src: "/aws.svg",
      alt: name,
    };
    
    const propsImagenBack = {
      key: id,
      src: img,
      alt: "aws",
    };

    return (
      <div className={styles.cards} key={id}>
        <div className={styles.front}>
          <img {...propsImagenFront} />
        </div>
        <div className={styles.back}>
          <img {...propsImagenBack} />
        </div>
      </div>
    );
  }

export default Card;
