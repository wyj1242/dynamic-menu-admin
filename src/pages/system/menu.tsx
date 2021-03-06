import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button, TreeSelect, Form, Table, Tag, Popconfirm, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormInstance
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import services from 'services';
import type { BaseMenuItem } from 'services/menu';
import { buildTree } from 'utils/tree';
import './menu.less';

const Menu: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [modalVisit, setModalVisit] = useState(false);

  const [defaultTreeData, setDefaultTreeData] = useState<{
    id?: number;
    menuName?: string;
  }>({});

  const [menuId, setMenuId] = useState<BaseMenuItem['id'] | undefined>(undefined);

  const queryClient = useQueryClient();

  const menuList = useQuery('menu.list', services.menu.getMenuList);

  const menuSelect = useQuery('menu.select', services.menu.getMenuSelect, {
    enabled: false
  });

  const menu = useQuery(['menu', menuId], () => services.menu.getMenuById(menuId as BaseMenuItem['id']), {
    enabled: !!menuId,
    onSuccess(res) {
      setModalVisit(true);
      setDefaultTreeData({
        id: res.data.parentId,
        menuName: res.data.parentName
      });
      formRef.current?.setFieldsValue({
        menuName: res.data.menuName,
        url: res.data.url,
        parentId: res.data.parentId,
        menuType: res.data.menuType,
        menuVisible: res.data.menuVisible,
        menuStatus: res.data.menuStatus
      });
      menuSelect.refetch();
    }
  });

  const refreshMenu = () => {
    queryClient.invalidateQueries('menu.nav');
    queryClient.invalidateQueries('menu.list');
  }

  const createMenu = useMutation(services.menu.createMenu, {
    onSuccess() {
      refreshMenu();
    }
  });

  const updateMenu = useMutation(services.menu.updateMenu, {
    onSuccess() {
      refreshMenu();
    }
  });

  const deleteMenu = useMutation(services.menu.deleteMenu, {
    onSuccess() {
      refreshMenu();
    }
  });

  const treeData = useMemo(() => {
    if (menuSelect.data?.code === 200) {
      return buildTree('id', 'parentId', menuSelect.data.data);
    } else {
      return [];
    }
  }, [menuSelect.data]);

  useEffect(() => {
    if (menuId) {
      if (menu.isFetching) {
        message.loading('???????????????...', 0);
      }
      if (!menu.isFetching) {
        message.destroy();
      }
    }
  }, [menu.isFetching]);

  return (
    <>
      <ModalForm
        className="modalForm"
        formRef={formRef}
        title="????????????"
        layout={'horizontal'}
        width={600}
        visible={modalVisit}
        initialValues={{
          menuName: '',
          url: '',
          parentId: 0,
          menuType: 1,
          menuVisible: 1,
          menuStatus: 1
        }}
        modalProps={{
          afterClose() {
            formRef.current?.resetFields();
            setMenuId(undefined);
          }
        }}
        onVisibleChange={setModalVisit}
        onFinish={async values => {
          if (menuId) {
            await updateMenu.mutateAsync({
              id: menuId,
              ...values
            });
            return true;
          }
          await createMenu.mutateAsync(values);
          return true;
        }}
      >
        <Form.Item name="parentId" label="????????????">
          <TreeSelect
            placeholder="???????????????"
            treeDefaultExpandAll
            treeData={menuSelect.isFetching ? [defaultTreeData] : treeData}
            fieldNames={{
              label: 'menuName',
              value: 'id'
            }}
          >
          </TreeSelect>
        </Form.Item>
        <ProFormRadio.Group
          label="????????????"
          name="menuType"
          options={[
            { label: '??????', value: 1 },
            { label: '??????', value: 2 },
          ]}
        />
        <ProFormText
          name="menuName"
          label="????????????"
          placeholder="?????????????????????"
          rules={[{ required: true, message: '???????????????' }]}
        />
        <ProFormText
          name="url"
          label="????????????"
          placeholder="?????????????????????"
          rules={[{ required: true, message: '???????????????' }]}
        />
        <ProForm.Group>
          <ProFormRadio.Group
            label="????????????"
            name="menuVisible"
            options={[
              { label: '??????', value: 1 },
              { label: '??????', value: 2 },
            ]}
          />
          <ProFormRadio.Group
            label="????????????"
            name="menuStatus"
            options={[
              { label: '??????', value: 1 },
              { label: '??????', value: 2 },
            ]}
          />
        </ProForm.Group>
      </ModalForm>
      <Button onClick={() => {
        setModalVisit(true);
        setDefaultTreeData({ id: 0, menuName: '?????????' });
        menuSelect.refetch();
      }} style={{ marginBottom: 24 }}>
        <PlusOutlined />
        ????????????
      </Button>
      <Table
        rowKey={'id'}
        dataSource={menuList.data?.data}
        loading={menuList.isFetching}
        columns={[
          {
            title: '??????',
            dataIndex: 'menuName',
            align: 'center'
          },
          {
            title: '????????????',
            dataIndex: 'parentName',
            align: 'center'
          },
          {
            title: '??????',
            dataIndex: 'menuType',
            align: 'center',
            render(_, record, index) {
              return <Tag color={record.menuType === 1 ? 'processing' : 'magenta'}>{record.menuType === 1 ? '??????' : '??????'}</Tag>
            }
          },
          {
            title: '??????URL',
            dataIndex: 'url',
            align: 'center'
          },
          {
            title: '??????',
            align: 'center',
            render(_, record, index) {
              return (
                <>
                  <Button type="link" onClick={() => {
                    setModalVisit(true);
                    setDefaultTreeData({
                      id: record.parentId,
                      menuName: record.parentName
                    });
                    formRef.current?.setFieldsValue({
                      parentId: record.parentId,
                      menuType: 2,
                      url: record.url
                    });
                    menuSelect.refetch();
                  }}>??????</Button>
                  <Button type="link" onClick={() => {
                    setMenuId(record.id);
                  }}>??????</Button>
                  <Popconfirm
                    title="????????????????"
                    okText="??????"
                    cancelText="??????"
                    onConfirm={() => {
                      if (record.children) {
                        message.error('?????????????????????');
                      } else {
                        return deleteMenu.mutateAsync(record.id);
                      }
                    }}
                  >
                    <Button type="link">??????</Button>
                  </Popconfirm>
                </>
              )
            }
          }
        ]}
      />
    </>
  );
}

export default Menu;