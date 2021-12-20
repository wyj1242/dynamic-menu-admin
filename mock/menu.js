const cloneDeep = require('lodash/cloneDeep');

let menuId = 100;

const menus = [
  {
    parentId: 0,
    id: 1,
    url: '/home',
    menuName: '首页',
    menuType: 1,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 0,
    id: 2,
    url: '/system',
    menuName: '系统管理',
    menuType: 1,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 3,
    url: '/system/user',
    menuName: '用户管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 4,
    url: '/system/role',
    menuName: '角色管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 5,
    url: '/system/permission',
    menuName: '权限管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 2,
    id: 6,
    url: '/system/menu',
    menuName: '菜单管理',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  }
];

module.exports = [
  {
    url: '/menu/nav',
    type: 'get',
    response: req => {
      return {
        code: 200,
        data: menus
      }
    }
  },
  {
    url: '/menu/select',
    type: 'get',
    response: req => {
      return {
        code: 200,
        data: [{
          parentId: -1,
          id: 0,
          url: '/',
          menuName: '主类目',
          menuType: 1,
          menuVisible: 1,
          menuStatus: 1
        }].concat(menus)
      }
    }
  },
  {
    url: '/menu/create',
    type: 'post',
    response: req => {
      menus.push({
        parentId: req.body.parentId,
        id: menuId++,
        url: req.body.url,
        menuName: req.body.menuName,
        menuType: req.body.menuType,
        menuVisible: req.body.menuVisible,
        menuStatus: req.body.menuStatus
      });
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/menu/delete/:id',
    type: 'delete',
    response: req => {
      const id = req.body.id;
      const index = menus.findIndex(menu => menu.id === id);
      menus.splice(index, 1);
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/menu/list',
    type: 'get',
    response: req => {
      const cloneMenus = cloneDeep(menus);

      const result = [];
      const menuMap = new Map();

      for (let menu of cloneMenus) {
        menu.children = menu.children || [];
        menuMap.set(menu.id, menu);
      }

      for (let menu of cloneMenus) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children.push({
            ...menu,
            parentName: parent.menuName
          })
        } else {
          result.push({
            ...menu,
            parentName: '一级菜单'
          });
        }
      }

      loopDeleteEmptyChildren(result);

      function loopDeleteEmptyChildren(source) {
        source.forEach(item => {
          if (item.children && item.children.length === 0) {
            delete item.children;
          }
          if (item.children && item.children.length > 0) {
            loopDeleteEmptyChildren(item.children);
          }
        });
      }

      return {
        code: 200,
        data: result
      }
    }
  }
];