import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { resetPassword } from '@utils/auth-api';

import styles from './ForgotPassword.module.css';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setShowPreloader(true);
    try {
      await resetPassword({ email });
      navigate('/reset-password', { state: { fromForgot: true } });
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Укажите e-mail"
              extraClass="mb-6"
              name={'email'}
            />
            <Button disabled={!email} htmlType="submit" type="primary" size="large">
              Восстановить
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
