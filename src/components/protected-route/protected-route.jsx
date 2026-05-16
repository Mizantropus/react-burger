import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { getIsAuthChecked, getUser } from '@services/auth';

export const Protected = ({ onlyAuthedAccess = true, component }) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuthedAccess && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!onlyAuthedAccess && user) {
    const { from } = location.state || { from: { pathname: '/' } };

    return <Navigate to={from.pathname} state={{ from: location }} />;
  }

  return component;
};

export const OnlyAuthed = Protected;
export const OnlyUnauthed = ({ component }) => (
  <Protected onlyAuthedAccess={false} component={component} />
);
