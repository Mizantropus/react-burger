import { useEffect, type JSX } from 'react';

import { getIngredientsDict } from '@/services/ingredients';
import { FeedOrdersList } from '@components/feed-orders-list/feed-orders-list';
import { Preloader } from '@components/preloader/preloader';
import { wsConnect, wsDisconnect } from '@services/actions/ordersUserSocketActions';
import { useAppDispatch, useAppSelector, type RootState } from '@services/store';
import { wsOrdersAllUrl } from '@utils/constants';

import styles from './profile-feed.module.css';

export const ProfileFeedTabContent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { ingredients, loading: isLoadingIngredients } = useAppSelector(
    (state: RootState) => state.ingredients
  );

  const { orders, gotFirstMessage } = useAppSelector(
    (state: RootState) => state.ordersUser
  );
  const ingredientsDict = useAppSelector((state: RootState) =>
    getIngredientsDict(state)
  );

  useEffect(() => {
    dispatch(
      // wsConnect(
      //   `${wsOrdersUserUrl}?token=${(localStorage.getItem('accessToken') as string).split('Bearer ')[1]}`
      // )
      wsConnect(wsOrdersAllUrl)
    );
    return (): void => {
      dispatch(wsDisconnect());
    };
  }, [dispatch, ingredients]);

  if (!gotFirstMessage || isLoadingIngredients) {
    return (
      <div className={styles.preloaderWrap}>
        <Preloader />
      </div>
    );
  }

  return (
    <>
      {
        <div className="pr-2">
          <FeedOrdersList
            orders={orders}
            ingredientsDict={ingredientsDict}
            linkpath="/profile/orders"
          />
        </div>
      }
    </>
  );
};
