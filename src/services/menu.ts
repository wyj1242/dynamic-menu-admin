import request from 'utils/request';

export interface BaseMenuItem {
  parentId: number;
  id: number;
  url: string;
  menuName: string;
  menuType: number;
  menuVisible: number;
  menuStatus: number;
}

export interface MenuItem extends BaseMenuItem {
  parentName: string;
  children?: MenuItem[];
}

type MenuNavModel = BaseMenuItem[];

type MenuSelectModel = BaseMenuItem[];

type MenuListModel = MenuItem[];

export function getMenuNav() {
  return request<MenuNavModel>({
    url: '/menu/nav'
  });
}

export function getMenuSelect() {
  return request<MenuSelectModel>({
    url: '/menu/select'
  });
}

export function postMenu(data: any) {
  return request({
    method: 'post',
    url: '/menu/create',
    data
  });
}

export function deleteMenu(id: BaseMenuItem['id']) {
  return request({
    method: 'delete',
    url: `/menu/delete/${id}`,
    data: { id }
  });
}

export function getMenuList() {
  return request<MenuListModel>({
    url: '/menu/list'
  });
}