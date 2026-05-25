import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@components/preloader/preloader';
import { getIsAuthChecked, getUser } from '@services/auth';
import { useAppSelector } from '@services/hooks';

import type { ReactNode, JSX, ReactElement, JSXElementConstructor } from 'react';

type TProtectedProps = {
  onlyAuthedAccess?: boolean;
  component: ReactNode;
};

export const Protected = ({
  onlyAuthedAccess = true,
  component,
}: TProtectedProps): JSX.Element => {
  const isAuthChecked = useAppSelector(getIsAuthChecked);
  const user = useAppSelector(getUser);
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

  return component as ReactElement<unknown, string | JSXElementConstructor<unknown>>;
};

export const OnlyAuthed = Protected;
export const OnlyUnauthed = ({ component }: { component: ReactNode }): JSX.Element => (
  <Protected onlyAuthedAccess={false} component={component} />
);
