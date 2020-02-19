import React from 'react';
import { registerComponent } from 'antd-form-mate';
import LocationPicker from './components/LocationPicker';

registerComponent('location', <LocationPicker />);

export {
  IntlProvider,
  IntlConsumer,
  createIntl,
  IntlType,
  zhCNIntl,
  enUSIntl,
} from './intl-context';
