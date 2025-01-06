import { Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Filters from './Filters'
import { SetLoader } from '../../redux/loadersSlice'
import { GetProduct } from '../../apicalls/products'
import Divider from '../../components/Divider'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import ProductCard from './ProductCard'

interface Product {
  images: string[]
  name: string
  _id: string
  description: string
  price: number
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
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const getData = async (search?: string) => {
    try {
      dispatch(SetLoader(true))
      const response = await GetProduct({
        ...filters,
        search: search || ''
      })
      dispatch(SetLoader(false))
      if (response.success) {
        setProducts(response.data)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  useEffect(() => {
    getData()
  }, [filters])

  useEffect(() => {
    getData(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

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
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className='flex gap-5 mt-5'>
            <div
              className={`grid gap-5 ${showFilters ? 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  sm:gap-2' : 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5  sm:gap-2'}`}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} onClick={() => navigate(`/product/${product._id}`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
