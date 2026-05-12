import { NavLink } from 'react-router-dom';

import styles from './NotFound.module.css';

export const NotFound = () => {
  return (
    <div className={styles.wrap}>
      <h1 className="text text_type_main-large">Страница не найдена</h1>
      <p>
        {' '}
        <NavLink to="/" className="text_color_accent td-none text_type_main-small">
          Вернуться на главную
        </NavLink>
      </p>
    </div>
  );
};
