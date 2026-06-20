import { useEffect, type JSX } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { ProfileFeedTabContent } from '@components/profile-feed/profile-feed';
import { ProfileFormTabContent } from '@components/profile-form/profile-form';
import { OnlyAuthed, OnlyUnauthed } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/Feed/Feed';
import { ForgotPassword } from '@pages/ForgotPassword/ForgotPassword';
import { Home } from '@pages/Home/Home';
import { Ingredient } from '@pages/Ingredient/Ingredient';
import { Login } from '@pages/Login/Login';
import { NotFound } from '@pages/NotFound/NotFound';
import { Profile } from '@pages/Profile/Profile';
import { Register } from '@pages/Register/Register';
import { ResetPassword } from '@pages/ResetPassword/ResetPassword';
import { checkIfUserAuthed } from '@services/auth';
import { useAppDispatch } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients';

import styles from './app.module.css';

export const App = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const dispatch = useAppDispatch();
  dispatch(checkIfUserAuthed());

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = (): void => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <>
        <AppHeader />
        <Routes location={background || location}>
          <Route index path="/" element={<Home />}></Route>
          <Route element={<OnlyUnauthed component={<Login />} />} path="/login"></Route>
          <Route
            element={<OnlyUnauthed component={<Register />} />}
            path="/register"
          ></Route>
          <Route
            element={<OnlyUnauthed component={<ForgotPassword />} />}
            path="/forgot-password"
          ></Route>
          <Route
            element={<OnlyUnauthed component={<ResetPassword />} />}
            path="/reset-password"
          ></Route>
          <Route path="/ingredient/:ingredientId" element={<Ingredient />}></Route>
          <Route element={<OnlyAuthed component={<Profile />} />} path="/profile">
            <Route element={<ProfileFormTabContent />} path="/profile" />
            <Route element={<ProfileFeedTabContent />} path="/profile/orders" />
          </Route>
          <Route element={<FeedPage />} path="/feed"></Route>
          <Route element={<OrderInfo />} path="/feed/:number"></Route>
          <Route element={<OnlyAuthed component={<NotFound />} />} path="*"></Route>
        </Routes>

        {background && (
          <Routes>
            <Route
              path="/ingredient/:ingredientId"
              element={
                <Modal closeHandler={handleModalClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path="/feed/:number"
              element={
                <Modal closeHandler={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path="/profile/orders/:number"
              element={
                <Modal closeHandler={handleModalClose}>
                  <OrderInfo insideModal={true} />
                </Modal>
              }
            />
          </Routes>
        )}
      </>
    </div>
  );
};
