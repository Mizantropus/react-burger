import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState, type JSX } from 'react';
import { NavLink } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { register } from '@services/auth';
import { useAppDispatch } from '@services/hooks';

import styles from './Register.module.css';

export const Register = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPreloader, setShowPreloader] = useState(false);

  async function formSubmitHandler(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setErrorMsg('');
    setShowPreloader(true);
    try {
      await dispatch(register({ name, email, password })).unwrap();
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
  }

  return (
    <>
      {showPreloader ? (
        <Preloader />
      ) : (
        <div className={styles.wrap}>
          <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
          <form onSubmit={formSubmitHandler} className={styles.form}>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
              extraClass="mb-6"
              name={'name'}
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              extraClass="mb-6"
              name={'email'}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              extraClass="mb-6"
              icon={'ShowIcon'}
              name={'password'}
            />
            <Button
              disabled={!(name && email && password)}
              htmlType="submit"
              type="primary"
              size="large"
            >
              Зарегистрироваться
            </Button>
          </form>
          <div className={styles.bottomTextWrap}>
            {errorMsg && (
              <p className="text text_type_main-default text_color_error mt-4">
                {errorMsg}
              </p>
            )}
            <p className="text text_type_main-default text_color_inactive mt-20">
              Уже зарегистрированы?{' '}
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
