import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';

interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await LoginUser(values);
      if (response.success && response.data) {
        message.success(response.message);
        localStorage.setItem('token', response?.data);
        navigate('/');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please check your input');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl font-bold mb-4">NORTHSIDE - LOGIN</h1>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block className="mt-4">
            Login
          </Button>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-lg">Don't have an account?{' '}
            <Link to="/register" className='text-blue-500 underline'>
              Register
            </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;