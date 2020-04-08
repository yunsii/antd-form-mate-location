import React from 'react';
import FormMate from 'antd-form-mate';
import { FormMateItemProps } from 'antd-form-mate/dist/interfaces';

import { LocationPickerProps } from '../../../src/components/LocationPicker';

const FormMateItem = (props: FormMateItemProps<'location', LocationPickerProps>) => {
  return <FormMate.Item {...props} />;
};

FormMateItem.displayName = FormMate.Item.displayName;

export default FormMateItem;
