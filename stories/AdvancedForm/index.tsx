import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { Form, Button } from 'antd';
import FormMate, { IntlProvider as FormIntlProvider, enUSIntl as formEnUSIntl } from 'antd-form-mate';
import { IntlProvider, enUSIntl } from '../../src';

import FormMateItem from '../components/FormMateItem';

const initialValues = {
  location: {
    position: { longitude: 114.104624, latitude: 22.554863 },
    formattedAddress: '广东省深圳市罗湖区桂园街道红岭2118号大院建设集团大厦',
  },
};

class AdvancedForm extends React.Component {
  handleFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  handleFinishFailed = (errors) => {
    console.log('Errors:', errors);
  };

  render() {
    return (
      <FormIntlProvider value={formEnUSIntl}>
        <IntlProvider value={enUSIntl}>
          <FormMate
            style={{ marginTop: 20 }}
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            initialValues={initialValues}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 12,
            }}
          >
            <FormMate.Item type='string' name='string' label='字符串' />
            <FormMateItem
              type='location'
              name='location'
              label='地址'
            />
            <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
              <Button type='primary' htmlType='submit' onClick={action('click submit')}>
                提交
              </Button>
            </Form.Item>
          </FormMate>
        </IntlProvider>
      </FormIntlProvider>
    );
  }
}

export default AdvancedForm;
