import React from 'react';
import * as Antd from 'antd';
import {
  FormProps as AntdFormProps,
  FormListProps as AntdFormListProps,
  FormItemProps as AntdFormItemProps,
} from 'antd/lib/form';
import cx from 'classnames';

import Icons from 'components/custom/icon';

import s from './styles.module.scss';
import Tooltip from '../tooltip';
import Grid from '../../custom/grid';

export type FormListProps = AntdFormListProps & {};

const FormList: React.FunctionComponent<FormListProps> = props => {
  const { ...listProps } = props;

  return <Antd.Form.List {...listProps} />;
};

export type FormItemProps = AntdFormItemProps<any> & {
  hint?: string;
};

const FormItem: React.FunctionComponent<FormItemProps> = props => {
  const { className, label, hint, children, ...itemProps } = props;

  return (
    <Antd.Form.Item
      className={cx(s.item, className)}
      {...itemProps}
      label={
        <Grid flow="col" gap={4} align="center">
          {label}
          {hint && (
            <Tooltip title={hint}>
              <Icons name="info-outlined" width={15} height={15} />
            </Tooltip>
          )}
        </Grid>
      }>
      {children}
    </Antd.Form.Item>
  );
};

export type FormProps = AntdFormProps & {};

const Form: React.FunctionComponent<FormProps> = props => {
  const { className, children, ...formProps } = props;

  return (
    <Antd.Form
      className={cx(s.form, className)}
      layout="vertical"
      requiredMark={false}
      {...formProps}>
      {children}
    </Antd.Form>
  );
};

export type StaticFormProps = {
  Item: React.FunctionComponent<FormItemProps>;
  List: React.FunctionComponent<FormListProps>;
};

((Form as any) as StaticFormProps).Item = FormItem;
((Form as any) as StaticFormProps).List = FormList;

export default Form as React.FunctionComponent<FormProps> & StaticFormProps;
