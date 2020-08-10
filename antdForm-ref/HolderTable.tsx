import React, { useEffect, useState, Fragment, createRef } from 'react';
import { 
  getPlaceholder,
  addPlaceholder,
} from '@/services/operatorSearch';
import { Table, Divider, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';
import EditForm from './EditForm';
import { HolderInst, PalaceParams } from './data';

interface EditModalProps extends FormComponentProps{
  visible: boolean;
  values?: Array<HolderInst>;
}
type MenuType = 'edit' | 'delete' | 'add';

// 从函数组件中antdForm 实例
const HolderList: React.FC<EditModalProps> = props => {
  const { visible } = props;
  const [list, setList] = useState([]);
  const [mData, setMData] = useState<HolderInst>({});
  const [mVisible, setMvisible] = useState(false);
  const formRef = createRef<FormComponentProps>();
  useEffect(() => {
    if (visible) {
      fetchList();
    }
  }, [visible]);
  const fetchList = async (param?: PalaceParams): Promise<any> => {
    const data = await getPlaceholder(param);
    // if (/20\d/.test(status)) {
      console.log(data);
    const { content } = data;
    setList(content);
  }
  const columns = [
    {
      title: '搜索提示语',
      dataIndex: 'placeholder',
      width: 150,
    },
    {
      title: '生效时间',
      dataIndex: 'effectTime',
      width: 150,
    },
    {
      title: '操作',
      width: '159px',
      dataIndex: 'action',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => menuClick('edit', record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => menuClick('delete', record)}>删除</a>
        </Fragment>
      ),
    },
  ];
  const menuClick = (key: MenuType, record) => {
    switch (key) {
      case 'edit':
        const { createTime, ...res } = record;
        setMvisible(true);
        setMData({
          ...res,
          createTime: moment(createTime),
        });
        break;
      case 'delete':
        break;
      default:
        setMData(null);
        setMvisible(true);
        break;
    }
  };
  const onChange = (val) => {
    setMData({
      ...mData,
      ...val,
    });
  }
  const closeModal = () => {
    setMvisible(false);
  }
  const submit = () => {
    formRef.current.form.validateFields((errors, values) => {
      if (!errors) {
        if (!!mData.id) {
          edit();
        } else {
          add();
        }
      }
    });
  }
  const add = async () => {
    const data = await addPlaceholder(mData);
    if (data) {
      message.success('新增提示语成功！');
      setMvisible(false);
    }
  };
  const edit = async () => {
    const data = await addPlaceholder(mData);
    if (data) {
      message.success('编辑提示语成功！');
      setMvisible(false);
    }
  };
  return (
    <>
      <Table
        rowKey="id"
        columns={columns} 
        dataSource={list}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={mData.id ? '编辑提示语' : '新增提示语'}
        width="450px"
        visible={mVisible}
        maskClosable={false}
        onCancel={closeModal}
        onOk={submit}
      >
        <EditForm 
          wrappedComponentRef={formRef}
          onChange={onChange}
          formData={mData}
        />
      </Modal>
    </>
  );
};


export default HolderList;
