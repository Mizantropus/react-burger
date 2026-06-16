import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { NavLink } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { logout, getUser, updateUserData } from '@services/auth';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './Profile.module.css';

export const Profile = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    name: nameStore = '',
    email: emailStore = '',
    password: passwordStore = '',
  } = useAppSelector(getUser) || {};

  const [name, setName] = useState(nameStore);
  const [email, setEmail] = useState(emailStore);
  const [password, setPassword] = useState('');
  const [showActionBtns, setShowActionsBtns] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);

  const logOutClickHandler = async (): Promise<void> => {
    await dispatch(logout());
  };

  const inputChangeHandler = (
    inputName: 'name' | 'email' | 'password',
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    const nextName = inputName === 'name' ? value : name;
    const nextEmail = inputName === 'email' ? value : email;
    const nextPassword = inputName === 'password' ? value : password;

    if (inputName === 'name') setName(value);
    if (inputName === 'email') setEmail(value);
    if (inputName === 'password') setPassword(value);

    const nameChanged = nextName !== nameStore;
    const emailChanged = nextEmail !== emailStore;
    const passwordChanged = nextPassword !== '' && nextPassword !== passwordStore;

    setShowActionsBtns(nameChanged || emailChanged || passwordChanged);
  };

  const cancelChangesBtnHandler = (): void => {
    setName(nameStore);
    setEmail(emailStore);
    setShowActionsBtns(false);
  };

  const formSubmitHandler = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setShowPreloader(true);
    setErrorMsg('');
    try {
      let payload: { name: string; email: string; password?: string } = { name, email };
      if (password) payload = { ...payload, password };
      await dispatch(updateUserData(payload)).unwrap();
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setErrorMsg(`Error: ${errorMessage}.`);
    } finally {
      setShowPreloader(false);
    }
  };
  const isNameChanged = name !== nameStore;
  const isEmailChanged = email !== emailStore;
  const isPasswordChanged = password !== '' && password !== passwordStore;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password === '' ? true : password.length >= 6;
  const saveEnabled =
    (isNameChanged || isEmailChanged || isPasswordChanged) &&
    (isEmailChanged ? isEmailValid : true) &&
    (isPasswordChanged ? isPasswordValid : true);

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
                  disabled={!saveEnabled}
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
