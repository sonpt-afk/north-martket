import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    status: 'approved'
  })
  const { user } = useSelector((state) => state.users)
  const navigate = useNavigate()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetProduct(filters)
      dispatch(SetLoader(false))
      if (response.success) {
        console.log(response)
        setProducts(response?.data)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <div className='grid  xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-2'>
        {products?.map((item) => {
          return (
            <div
              className='border cursor-pointer border-gray-300 p-4 rounded border-solid flex flex-col gap-5'
              key={item?._id}
              onClick={() => navigate(`/product/${item?._id}`)}
            >
              <img src={item?.images[0]} className='w-full h-40 object-cover' alt='itemAva' />
              <div className='px-2 flex flex-col gap-2'>
                <h1>{item?.name}</h1>
                <p className='text-sm '>{item?.description}</p>
                <Divider></Divider>

                <span className='text-lg font-semibold text-red-500'>$ {item?.price}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Home
