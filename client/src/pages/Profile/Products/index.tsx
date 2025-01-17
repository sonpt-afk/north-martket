import { Button, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import ProductsForm from './ProductsForm'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice'
import { DeleteProduct, GetProduct } from '../../../apicalls/products'
import moment from 'moment'
import Bids from './Bids'

const Products = () => {
  const [showProductForm, setShowProductForm] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { user } = useSelector((state) => state.users)
  const [showBids, setShowBids] = useState(false)
  const [bids, setBids] = useState([])
  const dispatch = useDispatch()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetProduct({
        seller: user?._id
      })
      dispatch(SetLoader(false))
      if (response.success) {
        setProducts(response?.data)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true))

      const response = await DeleteProduct(id)
      dispatch(SetLoader(false))
      if (response.success) {
        message.success(response.message)
        getData()
      } else {
        message.error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const columns = [
    { title: 'Name', dataIndex: 'name', align: 'center' },
    {
      title: 'Date Added',
      dataIndex: 'createdAt',
      align: 'center',
      render: (text, record) => {
        return moment(record?.createdAt).format('DD-MM-YYYY hh:mm A')
      }
    },
    { title: 'Description', dataIndex: 'description', align: 'center' },
    { title: 'Price', dataIndex: 'price', align: 'center' },
    { title: 'Category', dataIndex: 'category', align: 'center' },
    { title: 'Age', dataIndex: 'age', align: 'center' },
    { title: 'Status', dataIndex: 'status', align: 'center' },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => {
        return (
          <div className='flex gap-5 justify-center items-center'>
            <i
              className='ri-pencil-line hover:cursor-pointer'
              onClick={() => {
                setSelectedProduct(record)
                setShowProductForm(true)
              }}
            ></i>
            <i
              className='ri-delete-bin-2-line hover:cursor-pointer '
              onClick={() => {
                deleteProduct(record?._id)
              }}
            ></i>

            <span
              className='underline cursor-pointer'
              onClick={() => {
                setSelectedProduct(record)
                setShowBids(true)
              }}
            >
              Show Bids
            </span>
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <div className='flex  justify-end'>
        <Button
          type='default'
          onClick={() => {
            setShowProductForm(true)
            setSelectedProduct(null)
          }}
        >
          Add Product
        </Button>
      </div>
      <div className='w-full overflow-x-auto mt-10 	'>
        <Table
          columns={columns}
          dataSource={products}
          className='min-w-full table-fixed '
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            position: ['bottomCenter']
          }}
        />
      </div>{' '}
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}
      {showBids && <Bids showBidModal={showBids} setShowBidModal={setShowBids} selectedProduct={selectedProduct} />}
    </div>
  )
}

export default Products
