import { NavLink } from 'react-router-dom';

import styles from './OnWorking.module.css';

export const OnWorking = () => {
  return (
    <div className={styles.wrap}>
      <h1 className="text text_type_main-large">Страница находится в разработке</h1>
      <p>
        {' '}
        <NavLink to="/" className="text_color_accent td-none text_type_main-small">
          Вернуться на главную
        </NavLink>
      </p>
    </div>
  );
};
