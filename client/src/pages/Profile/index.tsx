import React, { useState } from 'react'
import { Activity } from 'react'
import { Tabs } from 'antd'
import Products from './Products'
import UserBids from './UserBids'
import { useSelector } from 'react-redux'
import moment from 'moment'

/**
 * Profile Component - Demonstrates React 19.2's <Activity> component
 *
 * Benefits:
 * 1. Selective Hydration: Each Activity boundary can hydrate independently
 * 2. State Preservation: Tab content state is preserved when switching tabs
 * 3. Resource Optimization: Effects are unmounted when tab is hidden
 * 4. Performance: Defers updates for hidden content until React is idle
 */
const Profile = () => {
  const { user } = useSelector((state) => state.users)
  const [activeTab, setActiveTab] = useState('1')

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  return (
    <div>
      {/* Performance Tip shown to user */}
      <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
        <p className='text-sm text-blue-800'>
          ⚡ <strong>React 19.2 Activity Component Active</strong> - Tab content is optimized with:
          State preservation when switching, Resource cleanup for hidden tabs, Selective hydration for better performance
        </p>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab='Products' key='1'>
          {/* Activity boundary for Products tab - enables selective hydration */}
          <Activity mode={activeTab === '1' ? 'visible' : 'hidden'}>
            <Products />
          </Activity>
        </Tabs.TabPane>

        <Tabs.TabPane tab='Bids' key='2'>
          {/* Activity boundary for Bids tab - preserves state when hidden */}
          <Activity mode={activeTab === '2' ? 'visible' : 'hidden'}>
            <UserBids />
          </Activity>
        </Tabs.TabPane>

        <Tabs.TabPane tab='General' key='3'>
          {/* Activity boundary for General tab - optimizes rendering */}
          <Activity mode={activeTab === '3' ? 'visible' : 'hidden'}>
            <div className='flex flex-col w-1/3 gap-5 mx-auto'>
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
          </Activity>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Profile
