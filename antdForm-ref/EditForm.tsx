import React, { forwardRef, useImperativeHandle } from 'react';
import { Input, DatePicker } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form/Form';
import { HolderInst, PalaceParams } from './data';

interface EditFormProps extends FormComponentProps{
  visible?: boolean;
  values?: Array<HolderInst>;
  formData: HolderInst;
  onChange: (val: HolderInst) => void;
}
const FormItem = Form.Item;

const EditForm = forwardRef<FormComponentProps, EditFormProps>(({ form }, ref) => {
  useImperativeHandle(ref, () => ({
    form,
  }));
  const disabledEndDate = startValue => {
    return startValue.valueOf() <= new Date().valueOf();
  };

  const { getFieldDecorator } = form;
  return (
    <>
      <Form layout='vertical'>
        <FormItem label="搜索提示语">
          {getFieldDecorator('placeholder', {
            rules: [{ required: true, message: '请填写搜索提示语!' }],
          })(<Input style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="生效时间">
          {getFieldDecorator('createTime', {
            rules: [{ required: true, message: '请选择生效时间!' }],
          })(
            <DatePicker
              disabledDate={disabledEndDate}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择"
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
      </Form>
    </>
  );
});

// 通过父组件或redux状态管理
export default Form.create<EditFormProps>({
  onValuesChange({ onChange }: any, changedValues) {
    if (onChange) {
      onChange(changedValues);
    }
  },
  // 表单值映射
  mapPropsToFields(props) {
    const { formData } = props;
    const target = {};
    Object.keys(formData).forEach(key => {
      target[key] = Form.createFormField({
        value: formData[key],
        name: key,
      });
    });
    return target;
  },
})(EditForm);
