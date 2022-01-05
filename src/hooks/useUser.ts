import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import services from 'services';
import { getToken, setToken, removeToken } from 'utils/auth';

export function useLogin() {
  const navigate = useNavigate();
  return useMutation(services.user.login, {
    onSuccess(res) {
      if (res.code === 200) {
        setToken(res.data);
        navigate('/home');
      }
    }
  });
}

export function useLogout() {
  const navigate = useNavigate();
  return useMutation(services.user.logout, {
    onSuccess(res) {
      if (res.code === 200) {
        removeToken();
        navigate('/login');
      }
    }
  });
}

export default function useUser() {
  return useQuery('user', services.user.getUserInfo, {
    enabled: !!getToken(),
    staleTime: Infinity
  });
}