import { Button, message, Tag, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SetLoader } from '../../redux/loadersSlice'
import { GetAllBids, GetProduct, GetProductById } from '../../apicalls/products'
import Divider from '../../components/Divider'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import BidModal from './BidModal'
import { getRecommendationEngine } from '../../utils/aiRecommendations'
import { getPriceEngine } from '../../utils/aiPriceSuggestion'
import ProductCard from '../Home/ProductCard'

const ProductInfo = () => {
  const { user } = useSelector((state) => state.users)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAddNewBid, setShowAddNewBid] = useState(false)
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [bidSuggestion, setBidSuggestion] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      if (id) {
        const response = await GetProductById(id)
        if (response.success) {
          const bidsResponse = await GetAllBids({ product: id })
          const productData = {
            ...response.data,
            bids: bidsResponse.data
          }
          setProduct(productData)

          // Get all products for AI recommendations
          const allProductsResponse = await GetProduct({ status: 'approved' })
          if (allProductsResponse.success) {
            // Get similar products using AI
            const recommendationEngine = getRecommendationEngine(allProductsResponse.data)
            const similar = recommendationEngine.getSimilarProducts(id, 4)
            setSimilarProducts(similar)

            // Get AI bid suggestion
            const priceEngine = getPriceEngine(allProductsResponse.data)
            const suggestion = priceEngine.suggestBidAmount(productData)
            setBidSuggestion(suggestion)
          }
        }
        dispatch(SetLoader(false))
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

            {/* AI Bid Suggestion */}
            {bidSuggestion && user?._id !== product?.seller?._id && (
              <Card className='mb-4 border-blue-200 bg-blue-50'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <i className="ri-sparkling-fill text-blue-500" />
                      <span className='font-semibold'>AI Bid Suggestion</span>
                      <Tag color="blue">Smart</Tag>
                    </div>
                    <div className='text-2xl font-bold text-blue-600'>
                      ${bidSuggestion.suggestedBid}
                    </div>
                    <div className='text-sm text-gray-600 mt-1'>
                      {bidSuggestion.reasoning}
                    </div>
                  </div>
                  <Button
                    type='primary'
                    size='small'
                    onClick={() => {
                      setShowAddNewBid(true)
                    }}
                  >
                    Use This Bid
                  </Button>
                </div>
              </Card>
            )}

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

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className='w-full mt-12 col-span-2'>
            <Divider />
            <div className='flex items-center gap-2 mb-6'>
              <i className="ri-sparkling-fill text-blue-500 text-2xl" />
              <h2 className='text-2xl font-bold text-gray-700'>You Might Also Like</h2>
              <Tag color="blue">AI Powered</Tag>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct._id}
                  product={similarProduct}
                  onClick={() => navigate(`/product/${similarProduct._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default ProductInfo
