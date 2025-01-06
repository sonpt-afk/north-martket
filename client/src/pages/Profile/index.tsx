import React from 'react'
import { Tabs } from 'antd'
import Products from './Products'
import UserBids from './UserBids'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
const Profile = () => {
  const { user } = useSelector((state) => state.users)
  console.log(user)
  return (
    <div>
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane tab='Products' key='1'>
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Bids' key='2'>
          <UserBids />
        </Tabs.TabPane>
        <Tabs.TabPane tab='General' key='3'>
          <div className='flex flex-col w-1/3 gap-5  mx-auto'>
            <h1 className='text-primary text-2xl text-center font-semibold'>MY PROFILE</h1>
            <p className='text-lg text-primary flex justify-between'>
              Name: <b className='text-lg'> {user.name}</b>
            </p>
            <p className='text-xl text-primary flex justify-between'>
              Email: <b className='text-lg'> {user.email}</b>
            </p>
            <p className='text-xl text-primary flex justify-between'>
              Created at: <b className='text-lg'>{moment(user?.createdAt).format('DD-MM-YYYY')}</b>
            </p>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Profile
