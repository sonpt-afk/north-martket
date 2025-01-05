import { Button, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../redux/loadersSlice'
import { GetProduct, UpdateProductStatus } from '../../apicalls/products'
import moment from 'moment'
import { GetUsers, UpdateUserStatus } from '../../apicalls/users'

const Users = () => {
  const [users, setUsers] = useState([])

  const dispatch = useDispatch()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetUsers(null)
      dispatch(SetLoader(false))
      if (response.success) {
        setUsers(response?.data)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  const onStatusUpdate = async (id: string, status: string) => {
    try {
      dispatch(SetLoader(true))
      const response = await UpdateUserStatus(id, status) // Pass status directly, not as object
      dispatch(SetLoader(false))
      if (response.success) {
        message.success(response.message)
        getData()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const columns = [
    { title: 'Name', dataIndex: 'name', align: 'center' },
    { title: 'Email', dataIndex: 'email', align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => {
        return record?.status.toUpperCase()
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => {
        const { status, _id } = record
        return (
          <div className='flex gap-3'>
            {status === 'active' && (
              <span className='underline cursor-pointer' onClick={() => onStatusUpdate(_id, 'blocked')}>
                Block
              </span>
            )}
            {status === 'blocked' && (
              <span className='underline cursor-pointer' onClick={() => onStatusUpdate(_id, 'active')}>
                Unblock
              </span>
            )}
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <Table columns={columns} dataSource={users} />
    </div>
  )
}

export default Users
