import Divider from '../../components/Divider'

interface Product {
  images: string[]
  name: string
  _id: string
  description: string
  price: number
}

interface ProductCardProps {
  product: Product
  onClick: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div className='border cursor-pointer border-gray-300 p-4 rounded border-solid flex flex-col gap-5' onClick={onClick}>
    <img src={product.images[0]} className='w-full h-40 p-5 rounded-md object-contain' alt={product.name} />
    <div className='px-2 flex flex-col gap-2'>
      <h1 className='font-semibold text-2xl'>{product.name}</h1>
      <p className='text-sm'>{product.description}</p>
      <Divider />
      <span className='text-lg font-semibold text-red-500'>$ {product.price}</span>
    </div>
  </div>
)

export default ProductCard
