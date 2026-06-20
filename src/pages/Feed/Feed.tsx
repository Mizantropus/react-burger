import { useEffect } from 'react';

import { FeedOrdersList } from '@components/feed-orders-list/feed-orders-list';
import { Preloader } from '@components/preloader/preloader';
import { wsConnect, wsDisconnect } from '@services/actions/ordersAllSocketActions';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { getIngredientsDict } from '@services/ingredients';
import { selectPendingOrders, selectCreatedOrders } from '@services/ordersAll';
import { wsOrdersAllUrl } from '@utils/constants';

import type { RootState } from '@/services/store';

import styles from './Feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { ingredients, loading: isLoadingIngredients } = useAppSelector(
    (state: RootState) => state.ingredients
  );

  const pendingOrders = useAppSelector((state: RootState) => selectPendingOrders(state));
  const createdOrders = useAppSelector((state: RootState) => selectCreatedOrders(state));

  const { orders, total, totalToday, gotFirstMessage } = useAppSelector(
    (state: RootState) => state.ordersAll
  );
  const ingredientsDict = useAppSelector((state: RootState) =>
    getIngredientsDict(state)
  );

  useEffect(() => {
    dispatch(wsConnect(wsOrdersAllUrl));

    return (): void => {
      dispatch(wsDisconnect());
    };
  }, [dispatch, ingredients]);

  return (
    <>
      {isLoadingIngredients || !gotFirstMessage ? (
        <Preloader />
      ) : (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Лента заказов
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <section className={`pr-2 ${styles.feed}`}>
              <FeedOrdersList
                orders={orders}
                ingredientsDict={ingredientsDict}
                linkpath="/feed"
              />
            </section>
            <section className={styles.feedInfo}>
              <div className={`mb-15 ${styles.board}`}>
                <div className={styles.boardColumn}>
                  <p className="mb-6 text text_type_main-medium">Готовы:</p>
                  <div className={styles.boardOrders}>
                    {pendingOrders.map((order) => (
                      <span
                        key={order._id}
                        className="mb-2 text text_type_digits-default text_color_success"
                      >
                        {order.number}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.boardColumn}>
                  <p className="mb-6 text text_type_main-medium">В работе:</p>
                  <div className={styles.boardOrders}>
                    {createdOrders.map((order) => (
                      <span
                        key={order._id}
                        className="mb-2 text text_type_digits-default text_color_success"
                      >
                        {order.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-15">
                <p className="text text_type_main-medium">Выполнено за все время:</p>
                <p className="text text_type_digits-large">{total}</p>
              </div>
              <div>
                <p className="text text_type_main-medium">Выполнено за сегодня:</p>
                <p className="text text_type_digits-large">{totalToday}</p>
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
};
