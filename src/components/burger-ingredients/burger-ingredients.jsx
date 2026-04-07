import { Tab } from '@krgaa/react-developer-burger-ui-components';

import { Ingredient } from '../ingredient/ingredient';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients, onIngredientClick }) => {
  let ingredientBlocks = {
    Булки: [],
    Начинки: [],
    Соусы: [],
  };

  ingredientBlocks['Булки'] = ingredients.filter(({ type }) => type === 'bun');
  ingredientBlocks['Начинки'] = ingredients.filter(({ type }) => type === 'main');
  ingredientBlocks['Соусы'] = ingredients.filter(({ type }) => type === 'sauce');

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>

      <div className={styles.tabContent}>
        {Object.entries(ingredientBlocks).map(([title, items]) => (
          <div key={title} className={styles.ingridientsBlock}>
            <h2 className="mb-6 text text_type_main-medium">{title}</h2>
            <div className={styles.ingridientsBlock__list}>
              {items.map((ingr_item) => (
                <Ingredient
                  key={ingr_item._id}
                  id={ingr_item._id}
                  name={ingr_item.name}
                  price={ingr_item.price}
                  image={ingr_item.image}
                  onClickHandler={onIngredientClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
