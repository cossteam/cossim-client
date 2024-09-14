import React from 'react';
import { Form, Input, Button, QRCode, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('登录信息:', values);
    // 这里添加登录逻辑
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{
        width: '600px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Title level={2} style={{ marginBottom: '20px' }}>登入</Title>
        <Paragraph style={{ color: '#888', marginBottom: '30px' }}>通过电子邮件或扫码登录您的账户</Paragraph>

        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ flex: 1, padding: '20px' }}>
            <Form form={form} onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: '请输入您的邮箱!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入您的密码!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
              <Form.Item>
                <div style={{ display: 'flex' }}>
                  <a href="/register">还没有账号？注册</a>
                  <a href="/forgot-password">忘记密码？</a>
                </div>
              </Form.Item>
            </Form>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <QRCode value="https://example.com/login" />
            <div style={{ marginTop: '10px', textAlign: 'left' }}>
              <Typography style={{ fontSize: '12px', lineHeight: '1.5' }}>1. 在你的手机中打开应用程序</Typography>
              <Typography style={{ fontSize: '12px', lineHeight: '1.5' }}>2. 点击角落里的"+"，然后点击扫描</Typography>
              <Typography style={{ fontSize: '12px', lineHeight: '1.5' }}>3. 将你的手机对准屏幕，确认登入</Typography>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
