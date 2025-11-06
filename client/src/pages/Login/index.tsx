import { useEffect, useOptimistic, useTransition } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { LoginUser } from '../../apicalls/users'
import { useDispatch } from 'react-redux'
import { SetLoader } from '../../redux/loadersSlice'

interface LoginFormValues {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: string
}

interface LoginState {
  email: string
  password: string
  status: 'idle' | 'pending' | 'success' | 'error'
}

const Login = () => {
  const [form] = Form.useForm<LoginFormValues>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isPending, startTransition] = useTransition()

  // Optimistic state for better UX
  const [optimisticState, setOptimisticState] = useOptimistic<LoginState, Partial<LoginState>>(
    { email: '', password: '', status: 'idle' },
    (state, newState) => ({ ...state, ...newState })
  )

  const onFinish = async (values: LoginFormValues) => {
    startTransition(async () => {
      try {
        // Optimistically update UI to show pending state
        setOptimisticState({ email: values.email, status: 'pending' })
        dispatch(SetLoader(true))

        const response = await LoginUser(values)
        dispatch(SetLoader(false))

        if (response.success && response.data) {
          // Optimistically update to success state
          setOptimisticState({ status: 'success' })
          message.success(response.message)
          localStorage.setItem('token', response.data)
          navigate('/')
        } else {
          setOptimisticState({ status: 'error' })
          throw new Error(response.message)
        }
      } catch (error) {
        dispatch(SetLoader(false))
        setOptimisticState({ status: 'error' })
        message.error(error instanceof Error ? error.message : 'An error occurred')
      }
    })
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className='flex justify-center items-center min-h-screen bg-primary px-5'>
      <div className='bg-white p-5 rounded w-[450px]'>
        <h1 className='text-primary text-2xl font-bold mb-4'>NORTHSIDE - LOGIN</h1>
        <Form form={form} name='login' onFinish={onFinish} autoComplete='off' layout='vertical'>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input disabled={isPending || optimisticState.status === 'pending'} />
          </Form.Item>

          <Form.Item
            className='bg-transparent'
            name='password'
            label='Password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              className='bg-transparent'
              disabled={isPending || optimisticState.status === 'pending'}
            />
          </Form.Item>
          <div className=' flex items-center justify-center'>
            <Button
              htmlType='submit'
              className='mt-4 bg-primary text-white'
              loading={isPending || optimisticState.status === 'pending'}
              disabled={isPending || optimisticState.status === 'pending'}
            >
              {optimisticState.status === 'pending' ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          <div className='mt-4 text-center'>
            <p className='text-gray-500 text-lg'>
              Don't have an account?{' '}
              <Link to='/register' className='text-blue-500 underline'>
                Register
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
