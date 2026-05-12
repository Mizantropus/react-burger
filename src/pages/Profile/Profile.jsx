import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { logout, getUser, updateUserData } from '@services/auth';

import styles from './Profile.module.css';

export const Profile = () => {
  const dispatch = useDispatch();
  const {
    name: nameStore,
    email: emailStore,
    password: passwordStore,
  } = useSelector(getUser);

  const [name, setName] = useState(nameStore);
  const [email, setEmail] = useState(emailStore);
  const [password, setPassword] = useState(passwordStore);
  const [showActionBtns, setShowActionsBtns] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);

  const logOutClickHandler = async () => {
    await dispatch(logout());
  };

  const inputChangeHandler = (inputName, event) => {
    const value = event.target.value;
    let haveChanges = false;
    if (inputName === 'name') {
      setName(value);
      haveChanges = value !== nameStore;
    }
    if (inputName === 'email') {
      setEmail(value);
      haveChanges = value !== emailStore;
    }
    if (inputName === 'password') {
      setPassword(value);
      haveChanges = value !== passwordStore;
    }
    setShowActionsBtns(haveChanges);
  };

  const cancelChangesBtnHandler = () => {
    setName(nameStore);
    setEmail(emailStore);
    setPassword(passwordStore);
    setShowActionsBtns(false);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setShowPreloader(true);
    setErrorMsg('');
    try {
      await dispatch(
        updateUserData({
          name,
          email,
          password,
        })
      ).unwrap();
    } catch (error) {
      setErrorMsg(
        `Ошибка: ${Object.hasOwnProperty.call(error, 'message') ? error.message : 'Неизвестная ошибка'}.`
      );
    } finally {
      setShowPreloader(false);
    }
  };

  return (
    <>
      {showPreloader ? (
        <Preloader />
      ) : (
        <div className={styles.profileWrapper}>
          <div className={styles.profileLeftCol}>
            <ul className="profileNavList mb-20">
              <li className="profileNavItem pt-4 pb-4">
                <NavLink
                  to="/profile"
                  className="text text_type_main-medium text_color_primary td-none"
                >
                  Профиль
                </NavLink>
              </li>
              <li className="profileNavItem pt-4 pb-4">
                <NavLink
                  to="/profile/orders"
                  className="text text_type_main-medium text_color_inactive td-none"
                >
                  История заказов
                </NavLink>
              </li>
              <li className="profileNavItem pt-4 pb-4">
                <button
                  onClick={logOutClickHandler}
                  className={`${styles.exitBtn} text text_type_main-medium text_color_inactive td-none`}
                >
                  Выход
                </button>
              </li>
            </ul>
            <p className="text text_type_main-small text_color_secondary pr-20">
              В этом разделе вы можете изменить свои персональные данные
            </p>
          </div>
          <form onSubmit={formSubmitHandler}>
            <Input
              type="text"
              value={name}
              placeholder="Имя"
              extraClass="mb-6 text_color_inactive"
              name={'name'}
              onChange={(e) => inputChangeHandler('name', e)}
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => inputChangeHandler('email', e)}
              placeholder="E-mail"
              extraClass="mb-6"
              name={'email'}
            />
            <Input
              type="password"
              value={password ?? ''}
              onChange={(e) => inputChangeHandler('password', e)}
              placeholder="Пароль"
              extraClass="mb-6"
              name={'password'}
            />
            {errorMsg && (
              <p className="text text_type_main-default text_color_error mb-4">
                {errorMsg}
              </p>
            )}
            {showActionBtns && (
              <div className={styles.profileActionBtns}>
                <Button
                  onClick={cancelChangesBtnHandler}
                  htmlType="button"
                  type="secondary"
                  size="medium"
                  extraClass="ml-2"
                >
                  Отмена
                </Button>
                <Button
                  disabled={!(name && email && password)}
                  htmlType="submit"
                  type="primary"
                  size="medium"
                  extraClass="ml-2"
                >
                  Сохранить
                </Button>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};
