import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { resetPasswordVerification } from '@utils/auth-api';

import styles from './ResetPassword.module.css';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);

  if (!location?.state?.fromForgot) {
    return <Navigate to="/forgot-password" replace />;
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setShowPreloader(true);
    try {
      await resetPasswordVerification({ password, token: code });
      navigate('/login');
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
        <div className={styles.wrap}>
          <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
          <form onSubmit={formSubmitHandler} className={styles.form}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
              extraClass="mb-6"
              icon={'ShowIcon'}
              name={'password'}
            />
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код из письма"
              extraClass="mb-6"
              name={'name'}
            />
            <Button htmlType="submit" type="primary" size="large">
              Сохранить
            </Button>
          </form>
          <div className={styles.bottomTextWrap}>
            {errorMsg && (
              <p className="text text_type_main-default text_color_error mt-4">
                {errorMsg}
              </p>
            )}
            <p className="text text_type_main-default text_color_inactive mt-20">
              Вспомнили пароль?{' '}
              <NavLink to="/login" className="text_color_accent td-none">
                Войти
              </NavLink>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
