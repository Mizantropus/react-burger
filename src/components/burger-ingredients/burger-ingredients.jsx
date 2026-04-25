import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectIngredientsCount } from '@services/burgerConstructor.jsx';

import { Ingredient } from '../ingredient/ingredient';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients, onIngredientClick }) => {
  const headerRefs = useRef({});
  const ingredientsTabContentRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Булки');
  const setHeaderRef = useCallback(
    (name) => (element) => {
      headerRefs.current[name] = element;
    },
    []
  );

  const ingredientBlocks = useMemo(
    () =>
      ingredients.reduce((acc, ingredient) => {
        if (ingredient.type === 'bun') {
          if (!acc['Булки']) acc['Булки'] = [];
          acc['Булки'].push(ingredient);
        } else if (ingredient.type === 'main') {
          if (!acc['Начинки']) acc['Начинки'] = [];
          acc['Начинки'].push(ingredient);
        } else if (ingredient.type === 'sauce') {
          if (!acc['Соусы']) acc['Соусы'] = [];
          acc['Соусы'].push(ingredient);
        }
        return acc;
      }, {}),
    [ingredients]
  );

  const onScrollIngredientsHandler = () => {
    const tabContentTop =
      ingredientsTabContentRef.current?.getBoundingClientRect().top ?? 0;
    const diffsDict = Object.fromEntries(
      Object.entries(headerRefs.current).map(([name, header]) => {
        const headerTop = header?.getBoundingClientRect().top ?? 0;
        return [Math.abs(tabContentTop - headerTop), name];
      })
    );
    const closestHeaderName = diffsDict[Math.min(...Object.keys(diffsDict).map(Number))];
    setActiveTab(closestHeaderName);
  };

  const switchTab = (tabValue) => {
    if (!headerRefs.current[tabValue]) return;
    ingredientsTabContentRef.current?.scrollTo({
      top: headerRefs.current[tabValue]?.offsetTop - 40,
      behavior: 'smooth',
    });
  };

  const ingredientsCount = useSelector(selectIngredientsCount);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="Булки" active={activeTab === 'Булки'} onClick={switchTab}>
            Булки
          </Tab>
          <Tab value="Начинки" active={activeTab === 'Начинки'} onClick={switchTab}>
            Начинки
          </Tab>
          <Tab value="Соусы" active={activeTab === 'Соусы'} onClick={switchTab}>
            Соусы
          </Tab>
        </ul>
      </nav>

      <div
        ref={ingredientsTabContentRef}
        className={styles.tabContent}
        onScroll={onScrollIngredientsHandler}
      >
        {Object.entries(ingredientBlocks).map(([title, items]) => (
          <div key={title} className={styles.ingridientsBlock}>
            <h2 ref={setHeaderRef(title)} className="mb-6 text text_type_main-medium">
              {title}
            </h2>
            <div className={styles.ingridientsBlock__list}>
              {items.map((ingr_item) => (
                <Ingredient
                  key={ingr_item._id}
                  id={ingr_item._id}
                  name={ingr_item.name}
                  price={ingr_item.price}
                  image={ingr_item.image}
                  count={ingredientsCount[ingr_item._id] || 0}
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
