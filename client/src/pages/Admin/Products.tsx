import { Button, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../redux/loadersSlice'
import { GetProduct, UpdateProductStatus } from '../../apicalls/products'
import moment from 'moment'

const Products = () => {
  const [showProductForm, setShowProductForm] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const dispatch = useDispatch()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetProduct(null)
      dispatch(SetLoader(false))
      if (response.success) {
        setProducts(response?.products)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      console.log('err', error)
      message.error(error?.message)
    }
  }

  const onStatusUpdate = async (id: string, status: string) => {
    try {
      dispatch(SetLoader(true))
      const response = await UpdateProductStatus(id, status) // Pass status directly, not as object
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
    {
      title: 'Seller',
      dataIndex: 'seller',
      align: 'center',
      render: (text, record) => {
        return record?.seller?.name
      }
    },
    { title: 'Description', dataIndex: 'description', align: 'center' },
    { title: 'Price', dataIndex: 'price', align: 'center' },
    { title: 'Category', dataIndex: 'category', align: 'center' },
    { title: 'Age', dataIndex: 'age', align: 'center' },
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
            {status === 'pending' && (
              <span className='underline cursor-pointer' onClick={() => onStatusUpdate(_id, 'approved')}>
                Approve
              </span>
            )}
            {status === 'pending' && (
              <span className='underline cursor-pointer' onClick={() => onStatusUpdate(_id, 'rejected')}>
                Reject
              </span>
            )}
            {status === 'approved' && (
              <span className='underline cursor-pointer' onClick={() => onStatusUpdate(_id, 'blocked')}>
                Block
              </span>
            )}
            {status === 'blocked' && (
              <span className='underline cursor-pointer' onClick={() => onStatusUpdate(_id, 'approved')}>
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
      <Table columns={columns} dataSource={products} />
    </div>
  )
}

export default Products
