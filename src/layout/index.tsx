import React, { useMemo } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown, Menu, Button, Avatar, Breadcrumb, Card } from 'antd';
import { EnvironmentTwoTone } from '@ant-design/icons';
import ProLayout, { MenuDataItem, getMenuData } from '@ant-design/pro-layout';
import useMenu from 'hooks/useMenu';
import useUser, { useLogout } from 'hooks/useUser';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isFetching, menuList } = useMenu();

  const { data: user } = useUser();

  const logout = useLogout();

  const getRoutes = (menuTree: typeof menuList): MenuDataItem[] => {
    return menuTree.map(menu => ({
      name: menu.menuName,
      path: menu.url ? menu.url : '',
      hideInMenu: menu.menuVisible === 1 ? false : true,
      routes: menu.children ? getRoutes(menu.children) : []
    }));
  }

  const breadcrumbItems = useMemo(() => {
    const { breadcrumbMap } = getMenuData(getRoutes(menuList));
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const items = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const route = breadcrumbMap.get(url);
      if (route) {
        return <Breadcrumb.Item key={route.path}>{route.name}</Breadcrumb.Item>;
      }
    });
    return items.filter(item => !!item);
  }, [location, menuList]);

  if (location.pathname === '/') {
    return <Navigate to={'/home'} />
  }

  return (
    <div
      id="layout"
      style={{ height: '100vh' }}
    >
      <ProLayout
        siderWidth={230}
        location={location}
        collapsed={false}
        collapsedButtonRender={false}
        disableMobile={true}
        headerContentRender={() => {
          return (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10
              }}
            >
              <EnvironmentTwoTone style={{ marginRight: 10 }} />
              <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            </div>
          )
        }}
        rightContentRender={() => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key={'logout'}>
                  <Button type={'link'} onClick={() => {
                    logout.mutate();
                  }}>退出</Button>
                </Menu.Item>
              </Menu>
            }
          >
            <div>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              <Button type={'link'} onClick={(e) => e.preventDefault()}>
                Hi, {user?.data.name}
              </Button>
            </div>
          </Dropdown>
        )}
        menu={{
          loading: isFetching
        }}
        menuDataRender={() => {
          return getRoutes(menuList);
        }}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              if (item.path && item.path !== location.pathname) {
                navigate(item.path);
              }
            }}
          >
            {dom}
          </a>
        )}
        onMenuHeaderClick={(e) => console.log(e)}
      >
        <Card bordered={false}>
          <Outlet />
        </Card>
      </ProLayout>
    </div>
  );
}

export default Layout;