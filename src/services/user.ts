import request from 'utils/request';

export interface AuthData {
  username: string;
  password: string;
}

export function login(data: AuthData) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}

export function getUserInfo() {
  return request({
    url: '/user/info'
  });
}