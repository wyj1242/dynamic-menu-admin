import React, { useRef, useMemo, useState } from 'react';
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
import { buildTree } from 'utils/tree';
import './menu.less';

const Menu: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const [modalVisit, setModalVisit] = useState(false);

  const [defaultTreeData, setDefaultTreeData] = useState<{
    id?: number;
    menuName?: string;
  }>({});

  const queryClient = useQueryClient();

  const menuList = useQuery('menu.list', services.menu.getMenuList);

  const menuSelect = useQuery('menu.select', services.menu.getMenuSelect, {
    enabled: false
  });

  const refreshMenu = () => {
    queryClient.invalidateQueries('menu.nav');
    queryClient.invalidateQueries('menu.list');
  }

  const createMenu = useMutation(services.menu.postMenu, {
    onSuccess() {
      refreshMenu();
    }
  });

  const deleteMenu = useMutation(services.menu.deleteMenu, {
    onSuccess() {
      refreshMenu();
    }
  })

  const treeData = useMemo(() => {
    if (menuSelect.data?.code === 200) {
      return buildTree('id', 'parentId', menuSelect.data.data);
    } else {
      return [];
    }
  }, [menuSelect.data]);

  return (
    <>
      <ModalForm
        className="modalForm"
        formRef={formRef}
        title="新增菜单"
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
          }
        }}
        onVisibleChange={setModalVisit}
        onFinish={values => {
          return createMenu.mutateAsync(values).then(res => {
            return true;
          });
        }}
      >
        <Form.Item name="parentId" label="上级菜单">
          <TreeSelect
            placeholder="请选择菜单"
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
          label="菜单类型"
          name="menuType"
          options={[
            { label: '目录', value: 1 },
            { label: '菜单', value: 2 },
          ]}
        />
        <ProFormText
          name="menuName"
          label="菜单名称"
          placeholder="请输入菜单名称"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText
          name="url"
          label="路由地址"
          placeholder="请输入路由地址"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProForm.Group>
          <ProFormRadio.Group
            label="显示状态"
            name="menuVisible"
            options={[
              { label: '显示', value: 1 },
              { label: '隐藏', value: 2 },
            ]}
          />
          <ProFormRadio.Group
            label="菜单状态"
            name="menuStatus"
            options={[
              { label: '正常', value: 1 },
              { label: '启用', value: 2 },
            ]}
          />
        </ProForm.Group>
      </ModalForm>
      <Button onClick={() => {
        setModalVisit(true);
        setDefaultTreeData({ id: 0, menuName: '主类目' });
        menuSelect.refetch();
      }} style={{ marginBottom: 24 }}>
        <PlusOutlined />
        新增菜单
      </Button>
      <Table
        rowKey={'id'}
        dataSource={menuList.data?.data}
        loading={menuList.isFetching}
        columns={[
          {
            title: '名称',
            dataIndex: 'menuName',
            align: 'center'
          },
          {
            title: '上级菜单',
            dataIndex: 'parentName',
            align: 'center'
          },
          {
            title: '类型',
            dataIndex: 'menuType',
            align: 'center',
            render(_, record, index) {
              return <Tag color={record.menuType === 1 ? 'processing' : 'magenta'}>{record.menuType === 1 ? '目录' : '菜单'}</Tag>
            }
          },
          {
            title: '菜单URL',
            dataIndex: 'url',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render(_, record, index) {
              return (
                <>
                  <Button type="link" onClick={() => {
                    setModalVisit(true);
                    setDefaultTreeData({
                      id: record.id,
                      menuName: record.menuName
                    });
                    formRef.current?.setFieldsValue({
                      parentId: record.id,
                      menuType: 2,
                      url: record.url
                    });
                    menuSelect.refetch();
                  }}>新增</Button>
                  <Button type="link">修改</Button>
                  <Popconfirm
                    title="确定要删除?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => {
                      if (record.children) {
                        message.error('请先删除子菜单');
                      } else {
                        return deleteMenu.mutateAsync(record.id);
                      }
                    }}
                  >
                    <Button type="link">删除</Button>
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