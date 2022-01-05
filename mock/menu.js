const cloneDeep = require('lodash/cloneDeep');

const PARENT_NAME = '主类目';

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
  },
  {
    parentId: 0,
    id: 7,
    url: '/video',
    menuName: '视频管理',
    menuType: 1,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 7,
    id: 8,
    url: '/video/list',
    menuName: '视频列表',
    menuType: 2,
    menuVisible: 1,
    menuStatus: 1
  },
  {
    parentId: 7,
    id: 9,
    url: '/video/:id',
    menuName: '视频详情',
    menuType: 2,
    menuVisible: 2,
    menuStatus: 1
  }
];

module.exports = [
  {
    url: '/menu/nav',
    type: 'get',
    response: req => {
      if (!req.headers['token']) {
        return {
          code: 201,
          data: 'bad authentication token'
        }
      }
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
            parentName: PARENT_NAME
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
  },
  {
    url: '/menu/update/:id',
    type: 'patch',
    response: req => {
      const id = +req.params.id;
      const menu = menus.find(menu => menu.id === id);
      Object.assign(menu, req.body);
      return {
        code: 200,
        data: 'success'
      }
    }
  },
  {
    url: '/menu/:id',
    type: 'get',
    response: req => {
      const id = +req.params.id;
      const menu = menus.find(menu => menu.id === id);
      let parentName = PARENT_NAME;
      menus.forEach(({ id, menuName }) => {
        if (id === menu.parentId) {
          parentName = menuName;
        }
      });
      return {
        code: 200,
        data: {
          parentName,
          ...menu
        }
      }
    }
  },
  {
    url: '/menu/delete/:id',
    type: 'delete',
    response: req => {
      const id = +req.params.id;
      const index = menus.findIndex(menu => menu.id === id);
      menus.splice(index, 1);
      return {
        code: 200,
        data: 'success'
      }
    }
  }
];