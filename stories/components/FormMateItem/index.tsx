import React from 'react';
import FormMate, { registerComponent } from 'antd-form-mate';
import { FormMateItemProps } from 'antd-form-mate/dist/interfaces';

import LocationPicker from '../../../src';
import { LocationPickerProps } from '../../../src/components/LocationPicker';

registerComponent('location', <LocationPicker />);

const FormMateItem = (props: FormMateItemProps<'location', LocationPickerProps>) => {
  return <FormMate.Item {...props} />;
};

FormMateItem.displayName = FormMate.Item.displayName;

export default FormMateItem;
