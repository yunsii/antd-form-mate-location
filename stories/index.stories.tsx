import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AdvancedForm from './AdvancedForm';
import AMap from './AMap';

storiesOf('ant-form-mate-location', module)
  .add('LocationPicker', () => <AdvancedForm />);

storiesOf('custom components', module)
  .add('AMap', () => <AMap />);
