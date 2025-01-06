import { Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Filters from './Filters'
import { SetLoader } from '../../redux/loadersSlice'
import { GetProduct } from '../../apicalls/products'
import Divider from '../../components/Divider'
import { useNavigate } from 'react-router-dom'

interface Product {
  images: string[]
  name: string
  _id: string
  description: string
}

const Home = () => {
  const dispatch = useDispatch()
  const [showFilters, setShowFilters] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    status: 'approved',
    category: [],
    age: []
  })
  const { user } = useSelector((state) => state.users)
  const navigate = useNavigate()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetProduct(filters)
      dispatch(SetLoader(false))
      if (response.success) {
        setProducts(response?.data)
        console.log('products', products)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  useEffect(() => {
    getData()
  }, [filters])

  return (
    <>
      <div className='flex gap-5'>
        {showFilters && (
          <Filters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        <div className='flex-col gap-5 w-full'>
          <div className='flex gap-5'>
            {!showFilters && (
              <i className='ri-equalizer-line text-xl cursor-pointer' onClick={() => setShowFilters(!showFilters)}></i>
            )}
            <Input
              type='text'
              placeholder='Search products here ...'
              className='border border-gray-300 rounded border-solid w-full p-2 h-14 '
            />
          </div>

          <div className='flex gap-5 mt-5'>
            <div
              className={`grid gap-5 ${showFilters ? 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  sm:gap-2' : 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5  sm:gap-2'}`}
            >
              {products?.map((item) => {
                return (
                  <div
                    className='border cursor-pointer border-gray-300 p-4 rounded border-solid flex flex-col gap-5 mb-5'
                    key={item?._id}
                    onClick={() => navigate(`/product/${item?._id}`)}
                  >
                    <img
                      src={item?.images[0]}
                      className='w-full h-40 p-5 rounded-md h-52 object-contain'
                      alt='itemAva'
                    />
                    <div className='px-2 flex flex-col gap-2'>
                      <h1 className='font-semibold text-2xl'>{item?.name}</h1>
                      <p className='text-sm '>{item?.description}</p>
                      <Divider></Divider>

                      <span className='text-lg font-semibold text-red-500'>$ {item?.price}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
