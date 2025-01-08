import { Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SetLoader } from '../../redux/loadersSlice'
import { GetAllBids, GetProduct, GetProductById } from '../../apicalls/products'
import Divider from '../../components/Divider'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import BidModal from './BidModal'

const ProductInfo = () => {
  const { user } = useSelector((state) => state.users)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAddNewBid, setShowAddNewBid] = useState(false)
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
          const bidsResponse = await GetAllBids({ product: id })
          setProduct({
            ...response.data,
            bids: bidsResponse.data
          })
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

  const currentYear = moment().year()

  return (
    product && (
      <div className='flex justify-center w-full'>
        <div className='grid lg:grid-cols-2 gap-5 sm:grid-cols-2 xs:grid-cols-2 md:grid-cols-2'>
          {/* images */}
          <div className='flex flex-col gap-2'>
            <div className='text-2xl font-bold'>{product?.name}</div>

            <img
              src={product?.images[selectedImageIndex]}
              alt='itemAvatar'
              className='w-full h-100 object-cover rounded-md sm:h-50 xs:h-50'
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
            <div className='text-xl mt-8' id='item-date'>
              Added on: {moment(product?.createdAt).format('DD-MM-YYYY')}
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
            <div className='text-xl'>Purchase year: {currentYear - product?.age}</div>
            <div className='text-xl'>Description: {product?.description}</div>
            <div className='text-xl'>Accessories available: {product?.accessoriesAvailable == true ? 'Yes' : 'No'}</div>
            <div className='text-xl'>Bill available: {product?.billAvailable == true ? 'Yes' : 'No'}</div>
            <div className='text-xl'>Box available: {product?.boxAvailable == true ? 'Yes' : 'No'}</div>
            <div className='text-xl'>Warranty available: {product?.warrantyAvailable == true ? 'Yes' : 'No'}</div>
            <Divider></Divider>
            <div className='text-2xl font-bold text-gray-500'>Seller Details</div>

            <div className='text-xl'>Seller: {product?.seller?.name}</div>
            <div className='text-xl'>Contact: {product?.seller?.email}</div>
            <Divider></Divider>
            <div className='text-2xl font-bold text-gray-500'>Bids</div>
            <Button
              disabled={user?._id === product?.seller?._id}
              className={`${user?._id === product?.seller?._id ? 'bg-gray-300 backdrop-blur-sm' : 'bg-primary text-white text-2xl font-bold'}`}
              onClick={() => setShowAddNewBid(!showAddNewBid)}
            >
              New Bid
            </Button>
            {product?.showBidsOnProductPage &&
              product?.bids?.map((bid) => {
                return (
                  <div className=' mt-2 border border-solid border-gray-500 p-4 rounded'>
                    <div className='flex justify-between'>
                      <span>Name</span>
                      <span>{bid?.buyer?.name}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Bid Amount</span>
                      <span>$ {bid?.bidAmount}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Bid Placed On</span>
                      <span>{moment(bid?.createdAt).format('DD-MM-YYYY')}</span>
                    </div>
                  </div>
                )
              })}
          </div>

          {showAddNewBid && (
            <BidModal
              setShowBidModal={setShowAddNewBid}
              showBidModal={showAddNewBid}
              product={product}
              reloadData={getData}
            />
          )}
        </div>
      </div>
    )
  )
}

export default ProductInfo
