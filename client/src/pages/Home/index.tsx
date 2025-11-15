import { Input, message, AutoComplete, Tag, Tooltip } from 'antd'
import { useEffect, useState, useOptimistic, useTransition } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Filters from './Filters'
import { SetLoader } from '../../redux/loadersSlice'
import { GetProduct } from '../../apicalls/products'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import ProductCard from './ProductCard'
import { getSearchEngine } from '../../utils/aiSearch'
import { getRecommendationEngine } from '../../utils/aiRecommendations'

interface Product {
  images: string[]
  name: string
  _id: string
  description: string
  price: number
}

interface FilterState {
  status: string
  category: string[]
  age: string[]
}

const Home = () => {
  const dispatch = useDispatch()
  const [showFilters, setShowFilters] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({
    status: 'approved',
    category: [],
    age: []
  })
  const { user } = useSelector((state) => state.users)
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()

  // AI Features
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Optimistic products state for instant UI updates
  const [optimisticProducts, setOptimisticProducts] = useOptimistic<Product[], Product[]>(
    products,
    (_, newProducts) => newProducts
  )

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const getData = async (search?: string) => {
    startTransition(async () => {
      try {
        dispatch(SetLoader(true))
        const response = await GetProduct({
          ...filters,
          search: search || ''
        })
        dispatch(SetLoader(false))
        if (response.success) {
          setProducts(response.data)

          // Initialize AI engines with product data
          const searchEngine = getSearchEngine(response.data)
          const recommendationEngine = getRecommendationEngine(response.data)

          // Get personalized recommendations for user
          if (user?._id) {
            const recommended = recommendationEngine.getRecommendationsForUser(user._id, 6)
            setRecommendedProducts(recommended)
            setShowRecommendations(recommended.length > 0)
          } else {
            // Show trending products for guests
            const trending = recommendationEngine.getTrendingProducts(6)
            setRecommendedProducts(trending)
            setShowRecommendations(trending.length > 0)
          }
        }
      } catch (error) {
        dispatch(SetLoader(false))
        message.error(error instanceof Error ? error.message : 'An error occurred')
      }
    })
  }

  useEffect(() => {
    getData()
  }, [filters])

  useEffect(() => {
    getData(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)

    // Generate AI-powered search suggestions
    if (value.trim().length >= 2) {
      const searchEngine = getSearchEngine(products)
      const suggestions = searchEngine.getSuggestions(value, 5)
      setSearchSuggestions(suggestions)
    } else {
      setSearchSuggestions([])
    }
  }

  const handleSearchSelect = (value: string) => {
    setSearchTerm(value)
    getData(value)
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
          <div className='flex gap-5 items-center'>
            {!showFilters && (
              <i className='ri-equalizer-line text-xl cursor-pointer' onClick={() => setShowFilters(!showFilters)}></i>
            )
            // TODO: remove duplicate placeholder text to make the search bar input field cleaner, not stacking texts
           
            }
            <div className='flex-1 relative'>
              <AutoComplete
                value={searchTerm}
                options={searchSuggestions.map(s => ({ value: s }))}
                onSearch={handleSearch}
                onSelect={handleSearchSelect}
                placeholder='Search products here...'
                className='w-full'
                size='large'
                allowClear
              >
                <Input.Search
                  size='large'
                  placeholder='Search products here...'
                  enterButton
                  prefix={<i className="ri-sparkling-line text-blue-500" />}
                />
              </AutoComplete>
              {searchSuggestions.length > 0 && (
                <div className='text-xs text-gray-500 mt-1'>
                  <i className="ri-lightbulb-line" /> AI-powered smart search
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations Section */}
          {showRecommendations && !searchTerm && recommendedProducts.length > 0 && (
            <div className='mt-8 mb-4'>
              <div className='flex items-center gap-2 mb-4'>
                <i className="ri-sparkling-fill text-blue-500 text-xl" />
                <h2 className='text-xl font-semibold'>
                  {user ? 'Recommended For You' : 'Trending Now'}
                </h2>
                <Tooltip title="Personalized recommendations based on your interests">
                  <Tag color="blue" className='ml-2'>AI Powered</Tag>
                </Tooltip>
              </div>
              <div className={`grid gap-5 ${showFilters ? 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-2' : 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 sm:gap-2'}`}>
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Products Section */}
          <div className='mt-5'>
            {searchTerm && (
              <div className='mb-3'>
                <span className='text-gray-600'>
                  Showing results for: <strong>{searchTerm}</strong>
                </span>
              </div>
            )}
            <div className='flex gap-5'>
              <div
                className={`grid gap-5 ${showFilters ? 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-2' : 'xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 sm:gap-2'}`}
                style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}
              >
                {optimisticProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onClick={() => navigate(`/product/${product._id}`)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
