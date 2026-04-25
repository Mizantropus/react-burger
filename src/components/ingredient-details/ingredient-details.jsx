import { useSelector } from 'react-redux';

import styles from './ingredient-details.module.css';

export const IngredientDetails = () => {
  const ingredient =
    useSelector((state) => state.ingredientDetails.ingredientDetails) || {};

  return (
    <div className="pt-3 pb-5">
      <p className="mb-8 text text_type_main-large">Детали ингредиента</p>
      <div className={`${styles.ingredientInfo__imagewrap} mb-4`}>
        <img
          className={`${styles.ingredientInfo__image} ml-5 mr-5`}
          src={ingredient.image}
          alt={ingredient.name}
        />
      </div>
      <p className={`${styles.ingredientInfo__name} mb-8 text text_type_main-medium`}>
        {ingredient.name}
      </p>
      <div
        className={`${styles.ingredientInfo__facts} pl-15 pr-15 text text_type_main-default text_color_inactive`}
      >
        <div className={`${styles.fact__block}`}>
          <span>Калории,ккал</span>
          <span>{ingredient.calories}</span>
        </div>
        <div className={styles.fact__block}>
          <span>Белки, г</span>
          <span>{ingredient.proteins}</span>
        </div>
        <div className={styles.fact__block}>
          <span>Жиры, г</span>
          <span>{ingredient.fat}</span>
        </div>
        <div className={styles.fact__block}>
          <span>Углеводы, г</span>
          <span>{ingredient.carbohydrates}</span>
        </div>
      </div>
    </div>
  );
};
