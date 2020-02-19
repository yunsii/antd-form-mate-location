import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { Form, Button } from 'antd';
import { createFormItems, IntlProvider as FormIntlProvider, enUSIntl as formEnUSIntl } from 'antd-form-mate';
import { ItemConfig } from 'antd-form-mate/dist/lib/props';
import { IntlProvider, enUSIntl } from '../../src';

const initialValues = {
  location: { position: { longitude: 114.104624, latitude: 22.554863 }, formattedAddress: "广东省深圳市罗湖区桂园街道红岭2118号大院建设集团大厦" },
};

class AdvancedForm extends React.Component {
  setFormItemsConfig = (detail: any = {}, mode?: string): ItemConfig[] => {
    return [
      {
        type: 'string',
        name: 'string',
        formItemProps: {
          label: '字符串',
        },
      },
      {
        type: 'location' as any,
        name: 'location',
        formItemProps: {
          label: '地址',
        },
      },
    ];
  }

  handleFinish = (values) => {
    console.log('Received values of form: ', values);
  }

  handleFinishFailed = (errors) => {
    console.log('Errors:', errors);
  }

  render() {
    return (
      <FormIntlProvider value={formEnUSIntl}>
        <IntlProvider value={enUSIntl}>
          <Form
            style={{ marginTop: 20 }}
            onFinish={this.handleFinish}
            onFinishFailed={this.handleFinishFailed}
            initialValues={initialValues}
          >
            {createFormItems(this.setFormItemsConfig({}))}
            <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={action('click submit')}
              >
                提交
          </Button>
            </Form.Item>
          </Form>
        </IntlProvider>
      </FormIntlProvider>
    )
  }
}

export default AdvancedForm;


