import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SetLoader } from '../../redux/loadersSlice'
import { GetProduct, GetProductById } from '../../apicalls/products'
import Divider from '../../components/Divider'
import { useNavigate, useParams } from 'react-router-dom'

const ProductInfo = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [product, setProduct] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      if (id) {
        const response = await GetProductById(id)
        dispatch(SetLoader(false))
        if (response.success) {
          setProduct(response?.data)
        }
      } else {
        dispatch(SetLoader(false))
        message.error('Product ID is not defined')
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  console.log('product', product)

  return (
    product && (
      <div className='grid grid-cols-2 gap-5'>
        {/* images */}
        <div className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{product?.name}</div>

          <img
            src={product?.images[selectedImageIndex]}
            alt='itemAvatar'
            className='w-full h-100 object-cover rounded-md'
          />
          <div className='flex gap-5'>
            {product.images.map((image, index) => {
              return (
                <img
                  className={
                    'w-20 h-20 object-cover rounded-md cursor-pointer ' +
                    (selectedImageIndex === index ? 'border-2 border-green-500 border-dashed p-2 ' : '')
                  }
                  onClick={() => setSelectedImageIndex(index)}
                  alt='subimg'
                  src={image}
                />
              )
            })}
          </div>
        </div>

        {/* details */}
        <div className='flex flex-col gap-5 '>
          <div className='text-2xl font-bold text-gray-500'>Product Details</div>

          <div>
            <span className='text-xl'>
              {' '}
              Price: <b className='text-xl text-green-500'> $ {product?.price}</b>
            </span>
          </div>
          <div className='text-xl'>Category: {product?.category}</div>
          <div className='text-xl'>Age: {product?.age}</div>
          <div className='text-xl'>Description: {product?.description}</div>
          <div className='text-xl'>Accessories available: {product?.accessoriesAvailable == true ? 'Yes' : 'No'}</div>
          <div className='text-xl'>Bill available: {product?.billAvailable == true ? 'Yes' : 'No'}</div>
          <div className='text-xl'>Box available: {product?.boxAvailable == true ? 'Yes' : 'No'}</div>
          <div className='text-xl'>Warranty available: {product?.warrantyAvailable == true ? 'Yes' : 'No'}</div>
          <Divider></Divider>
          <div className='text-2xl font-bold text-gray-500'>Seller Details</div>

          <div className='text-xl'>Seller: {product?.seller?.name}</div>
          <div className='text-xl'>Contact: {product?.seller?.email}</div>
        </div>
      </div>
    )
  )
}

export default ProductInfo
