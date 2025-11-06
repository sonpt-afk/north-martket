import { useEffect, useOptimistic, useTransition } from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, message } from 'antd'
import { RegisterUser } from '../../apicalls/users'
import { Link, useNavigate } from 'react-router-dom'
import { SetLoader } from '../../redux/loadersSlice'
import { useDispatch } from 'react-redux'

type FieldType = {
  name: string
  password: string
  email: string
}

interface RegisterState {
  name: string
  email: string
  status: 'idle' | 'pending' | 'success' | 'error'
}

const Register = () => {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const [isPending, startTransition] = useTransition()

  // Optimistic state for better UX during registration
  const [optimisticState, setOptimisticState] = useOptimistic<RegisterState, Partial<RegisterState>>(
    { name: '', email: '', status: 'idle' },
    (state, newState) => ({ ...state, ...newState })
  )

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    startTransition(async () => {
      try {
        // Optimistically update UI to show pending state
        setOptimisticState({ name: values.name, email: values.email, status: 'pending' })
        dispatch(SetLoader(true))

        const response = await RegisterUser(values)
        dispatch(SetLoader(false))

        if (response.success) {
          // Optimistically update to success state
          setOptimisticState({ status: 'success' })
          message.success(response.message)
          nav('/login')
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
      nav('/')
    }
  }, [nav])

  return (
    <div className='bg-primary  h-screen flex items-center justify-center'>
      <div className='max-w-md p-10	sm:w-4/5 bg-white'>
        <div className=' capitalize text-2xl	font-bold text-gray-500'>
          <span className='text-primary text-2xl	font-bold'>North marketplace</span> - Register
        </div>
        <hr className='mt-2 mb-2' />
        <Form name='basic' layout='vertical' onFinish={onFinish} autoComplete='off' className=''>
          <Form.Item<FieldType>
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input className='w-full' disabled={isPending || optimisticState.status === 'pending'} />
          </Form.Item>

          <Form.Item<FieldType>
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input className='w-full' disabled={isPending || optimisticState.status === 'pending'} />
          </Form.Item>

          <Form.Item<FieldType>
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input
              type='password'
              className='w-full 	'
              disabled={isPending || optimisticState.status === 'pending'}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div className=' flex items-center justify-center'>
              <Button
                htmlType='submit'
                className='mt-4 bg-primary text-white'
                loading={isPending || optimisticState.status === 'pending'}
                disabled={isPending || optimisticState.status === 'pending'}
              >
                {optimisticState.status === 'pending' ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </Form.Item>

          <div className='switch-page mt-4 text-center'>
            <p className='text-lg'>
              Have an account already?{' '}
              <Link to='/login' className='text-blue-500 underline'>
                Login
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register
