import {
  FormattedDate,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { orderStatusesTranslation, type TIngredient, type TOrder } from '@/types';

import styles from './feed-orders-list.module.css';

type IFeedProps = {
  orders: TOrder[];
  ingredientsDict: Record<string, TIngredient>;
  linkpath: string;
};

export const FeedOrdersList = ({
  orders,
  ingredientsDict,
  linkpath,
}: IFeedProps): React.JSX.Element => {
  const location = useLocation();

  return (
    <>
      {orders.map((order) => (
        <Link
          key={order._id}
          to={`${linkpath}/${order.number}`}
          state={{ background: location }}
          className={styles.feedItemLink}
        >
          <article className={`mb-6 ${styles.feedItem}`}>
            <div className={`${styles.feedItemTop} mb-6`}>
              <span className="text text_type_digits-default">#{order.number}</span>
              <FormattedDate
                className="text text_type_main-default text_color_inactive text_type_main-small"
                date={new Date(order.createdAt)}
              />
            </div>
            <p className="mb-2 text text_type_main-medium">{order.name}</p>
            <p className="mb-6 text text_type_main-small">
              {orderStatusesTranslation[order.status]}
            </p>
            <div className={`${styles.feedItemBottom}`}>
              <div className={styles.feedIngredientImages}>
                {order.ingredients.slice(0, 5).map((ingredientId, index) => (
                  <div
                    key={`ingredientId${index}`}
                    className={styles.feedIngredientImage}
                    style={{
                      zIndex: 6 - index,
                      right: `${20 * index}px`,
                    }}
                  >
                    <img
                      src={ingredientsDict[ingredientId].image}
                      alt={ingredientsDict[ingredientId].name}
                    />
                  </div>
                ))}
                {order.ingredients.length > 5 && (
                  <div
                    className={styles.feedIngredientImage}
                    style={{ right: '100px', zIndex: 1 }}
                  >
                    <img
                      src={ingredientsDict[order.ingredients[5]].image}
                      alt={ingredientsDict[order.ingredients[5]].name}
                    />
                    {order.ingredients.length > 6 && (
                      <span
                        className={`text text_type_digits-default ${styles.feedIngredientImageMoreCount}`}
                      >
                        {`+${order.ingredients.length - 6}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.feedItemPriceWrap}>
                <span className="mr-2 feedItemPrice text text_type_digits-default">
                  {order.ingredients.reduce(
                    (acc, ingredientId) => (acc += ingredientsDict[ingredientId].price),
                    0
                  )}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          </article>
        </Link>
      ))}
    </>
  );
};
