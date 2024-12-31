import { Button, message, Table } from 'antd'
import React, { useEffect } from 'react'
import ProductsForm from './ProductsForm'
import { useDispatch } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice'
import { DeleteProduct, GetProduct } from '../../../apicalls/products'
import moment from 'moment'

const Products = () => {
  const [showProductForm, setShowProductForm] = React.useState(false)
  const [products, setProducts] = React.useState([])
  const dispatch = useDispatch()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetProduct()
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
          <div className='flex gap-5'>
            <i className='ri-pencil-line hover:cursor-pointer'></i>
            <i
              className='ri-delete-bin-2-line hover:cursor-pointer '
              onClick={() => {
                deleteProduct(record?._id)
              }}
            ></i>
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <div className='flex  justify-end'>
        <Button type='default' onClick={() => setShowProductForm(true)}>
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
      {showProductForm && <ProductsForm showProductForm={showProductForm} setShowProductForm={setShowProductForm} />}
    </div>
  )
}

export default Products
