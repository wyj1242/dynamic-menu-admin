import React from 'react';
import { useParams } from 'react-router';
import { Navigate, RouteProps, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import useUser from 'hooks/useUser';
import useMenu from 'hooks/useMenu';
import { getToken } from 'utils/auth';

export interface WrapperRouteProps extends RouteProps {
  auth?: boolean;
}

const WrapperRouteComponent: React.FC<WrapperRouteProps> = ({ auth, ...props }) => {
  const location = useLocation();
  const params = useParams();

  const { data: user } = useUser();
  const { isLoading, data } = useMenu();

  if (auth) {
    if (!user && !getToken()) {
      return <Navigate to={'/login'} />
    }
    if (isLoading) {
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Spin tip="数据加载中..." />
        </div>
      )
    }
    if (data) {
      const pathnames = ['/', ...data.data.map(item => params.id ? item.url.replace(/:id/g, params.id) : item.url)];
      if (!pathnames.includes(location.pathname)) {
        return <Navigate to={'/403'} />
      }
    }
  }

  return props.element as React.ReactElement;
}

WrapperRouteComponent.defaultProps = {
  auth: true
}

export default WrapperRouteComponent;