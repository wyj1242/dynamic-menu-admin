import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import useUser from 'hooks/useUser';
import { getToken } from 'utils/auth';

export interface WrapperRouteProps extends RouteProps {
  auth?: boolean;
}

const WrapperRouteComponent: React.FC<WrapperRouteProps> = ({ auth, ...props }) => {
  const { data: user } = useUser();

  if (auth) {
    if (!user && !getToken()) {
      return <Navigate to={'/login'} />
    }
  }

  return props.element as React.ReactElement;
}

WrapperRouteComponent.defaultProps = {
  auth: true
}

export default WrapperRouteComponent;