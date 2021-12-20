import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import { message } from 'antd';
import { history } from 'routes/history';
import { getToken } from 'utils/auth';

interface Response<T> {
  code: number;
  data: T
}

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers!.token = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(response => {
  if (response.data) {
    if (response.data.code === 201) {
      message.error(response.data.data);
      history.push('/login');
    }
  }
  return response;
})

export default function request<T = any>(config: AxiosRequestConfig): Promise<Response<T>> {
  return new Promise((resolve, reject) => {
    axiosInstance.request(config).then(res => {
      resolve(res.data);
    }).catch(error => {
      reject(error);
    });
  });
}