import { useMemo } from 'react';
import { useQuery } from 'react-query';
import services from 'services';
import { buildTree } from 'utils/tree';

export default function useMenu() {
  const { data, ...rest } = useQuery('menu.nav', services.menu.getMenuNav, {
    staleTime: Infinity,
    select: data => {
      return data;
    }
  });

  const menuList = useMemo(() => {
    if (data?.code === 200) {
      return buildTree('id', 'parentId', data.data);
    } else {
      return [];
    }
  }, [data]);

  return {
    data,
    menuList,
    ...rest
  }
}