import React from 'react'
import { Button, Form, Input, InputNumber, Card, Row, Col } from 'antd';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: (label) => `${label} is required!`,
  types: {
    email: (label) => `${label} is not a valid email!`,
    number: (label) => `${label} is not a valid number!`,
  },
  number: {
    range: (label, min, max) => `${label} must be between ${min} and ${max}`,
  },
};

const onFinish = (values) => {
  console.log(values);
};

export default function Contact() {
  return (
    <main style={{ padding: '50px' }}>
      <Row justify="center">
        <Col xs={24} md={12}>
          <Card title="Contact Us" bordered={false}>
            <Form
              {...layout}
              name="nest-messages"
              onFinish={onFinish}
              validateMessages={validateMessages}
            >
              <Form.Item
                name={['user', 'name']}
                label="Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['user', 'email']}
                label="Email"
                rules={[
                  {
                    type: 'email',
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['user', 'age']}
                label="Age"
                rules={[
                  {
                    type: 'date',
                    min: 15,
                    max: 99,
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name={['user', 'website']}
                label="Website"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['user', 'introduction']}
                label="Introduction"
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 16,
                  offset: 8,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
