import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OnlyAuthed, OnlyUnauthed } from '@components/protected-route/protected-route';
import { ForgotPassword } from '@pages/ForgotPassword/ForgotPassword';
import { Home } from '@pages/Home/Home';
import { Ingredient } from '@pages/Ingredient/Ingredient';
import { Login } from '@pages/Login/Login';
import { NotFound } from '@pages/NotFound/NotFound';
import { OnWorking } from '@pages/OnWorking/OnWorking';
import { Profile } from '@pages/Profile/Profile';
import { Register } from '@pages/Register/Register';
import { ResetPassword } from '@pages/ResetPassword/ResetPassword';
import { checkIfUserAuthed } from '@services/auth';

import styles from './app.module.css';

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const dispatch = useDispatch();
  dispatch(checkIfUserAuthed());

  const handleModalClose = () => {
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
          <Route
            element={<OnlyAuthed component={<Profile />} />}
            path="/profile"
          ></Route>
          <Route
            element={<OnlyAuthed component={<Ingredient />} />}
            path="/ingredient/:ingredientId"
          ></Route>
          <Route
            element={<OnlyAuthed component={<OnWorking />} />}
            path="/profile/orders"
          ></Route>
          <Route element={<OnlyAuthed component={<OnWorking />} />} path="/feed"></Route>
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
          </Routes>
        )}
      </>
    </div>
  );
};
