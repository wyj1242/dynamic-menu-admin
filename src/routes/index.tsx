import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import getAsyncComponent from 'components/asyncComponent';
import WrapperRouteComponent from './WrapperRouteComponent';

import Login from 'pages/login';
import Layout from 'layout';

const asyncComponent = (resolve: any) => {
  return getAsyncComponent({
    resolve,
    loading: (
      <div style={{ textAlign: 'center' }}>
        <Spin />
      </div>
    ),
    delay: 300
  })
}

const Home = asyncComponent(() => import('pages/home'));
const User = asyncComponent(() => import('pages/system/user'));
const Role = asyncComponent(() => import('pages/system/role'));
const Permission = asyncComponent(() => import('pages/system/permission'));
const Menu = asyncComponent(() => import('pages/system/menu'));
const VideoList = asyncComponent(() => import('pages/video/list'));
const VideoDetails = asyncComponent(() => import('pages/video/details'));

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<Login />} auth={false} />
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<Layout />} />,
    children: [
      {
        path: 'home',
        element: <WrapperRouteComponent element={<Home />} />
      },
      {
        path: 'system/user',
        element: <WrapperRouteComponent element={<User />} />
      },
      {
        path: 'system/role',
        element: <WrapperRouteComponent element={<Role />} />
      },
      {
        path: 'system/permission',
        element: <WrapperRouteComponent element={<Permission />} />
      },
      {
        path: 'system/menu',
        element: <WrapperRouteComponent element={<Menu />} />
      },
      {
        path: 'video/list',
        element: <WrapperRouteComponent element={<VideoList />} />
      },
      {
        path: 'video/:id',
        element: <WrapperRouteComponent element={<VideoDetails />} />
      }
    ]
  },
  {
    path: '/403',
    element: <h3>No permissions</h3>
  },
  {
    path: '/404',
    element: <h3>The page can't be found</h3>
  },
  {
    path: '*',
    element: <Navigate to={'/404'} replace />
  }
];

export default routes;