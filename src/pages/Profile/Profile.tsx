import { useState } from 'react';
import { NavLink, Outlet, matchRoutes } from 'react-router-dom';

import { Preloader } from '@/components/preloader/preloader';
import { logout } from '@/services/auth';
import { useAppDispatch } from '@/services/hooks';

import type React from 'react';

import styles from './Profile.module.css';

export const Profile = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [showIsLoggingOutPreloader, setshowIsLoggingOutPreloader] = useState(false);

  const isActiveLink = (path: string): boolean => {
    const routes = matchRoutes([{ path, caseSensitive: false }], location.pathname);
    return routes !== null;
  };

  const logOutClickHandler = async (): Promise<void> => {
    setshowIsLoggingOutPreloader(true);
    await dispatch(logout());
  };

  if (showIsLoggingOutPreloader) {
    return <Preloader />;
  }

  return (
    <>
      <div className={styles.profileWrapper}>
        <div className={styles.profileLeftCol}>
          <ul className="profileNavList mb-20">
            <li className="profileNavItem pt-4 pb-4">
              <NavLink
                to="/profile"
                className={`text text_type_main-medium text_color_inactive td-none ${
                  isActiveLink('/profile') && styles.text_color_primary
                }`}
              >
                Профиль
              </NavLink>
            </li>
            <li className="profileNavItem pt-4 pb-4">
              <NavLink
                to="/profile/orders"
                className={`text text_type_main-medium text_color_inactive td-none ${
                  isActiveLink('/profile/orders') && styles.text_color_primary
                }`}
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
          {isActiveLink('/profile') && (
            <p className="text text_type_main-small text_color_secondary pr-20">
              В этом разделе вы можете изменить свои персональные данные
            </p>
          )}
          {isActiveLink('/profile/orders') && (
            <p className="text text_type_main-small text_color_secondary pr-20">
              В этом разделе вы можете просмотреть свою историю заказов
            </p>
          )}
        </div>
        <div className={styles.contentTabWrap}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
