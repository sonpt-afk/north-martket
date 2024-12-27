import React, { useEffect } from 'react'
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { RegisterUser } from '../../apicalls/users';
import { Link, useNavigate } from "react-router";
import { SetLoader } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';

type FieldType = {
  name: string;
  password: string;
  email: string;
};


const Register: React.FC = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const onFinish: FormProps<FieldType>['onFinish'] = async(values) => {
    try{
            dispatch(SetLoader(true));
      
      const response = await RegisterUser(values)
      nav('/login')
            dispatch(SetLoader(false));
      
      if(response.success){
        message.success(response.message)
      }else{
        throw new Error(response.message);
      }
    }catch(error){
      message.error(error instanceof Error ? error.message : 'An error occurred')
    }
  };

  useEffect(() => {
    if(localStorage.getItem('token')){
      nav('/')
    }
  })
   
  return (
    <>
      <div className="bg-primary  h-screen flex items-center justify-center">
        <div className="max-w-md p-10	sm:w-4/5 bg-white">
          <div className=' capitalize text-2xl	font-bold text-gray-500'><span className='text-primary text-2xl	font-bold'>North marketplace</span>  - Register</div>
          <hr className='mt-2 mb-2' />
          <Form
            name="basic"
            layout="vertical"
                        onFinish={onFinish}
            autoComplete="off"
            className=''
          >
            <Form.Item<FieldType>
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input className='w-full'/>
            </Form.Item>

            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input className='w-full'/>
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input type='password' className='w-full 	' />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary"  htmlType="submit" className='w-full mt-4' >
                Submit
              </Button>
            </Form.Item>
          
          <div className="switch-page mt-4 text-center"> 
            <p className='text-lg'>Have an account already? <Link to="/login" className='text-blue-500 underline'>Login</Link></p>
          </div>
          </Form>

        </div>
      </div>
    </>
  )
}

export default Register