import { Button, message, Upload } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice'
import { UploadProductImage } from '../../../apicalls/products'
import { ImageUploadPayload } from '../../../types/image'

interface ImagesProps {
  showProductForm: boolean
  setShowProductForm: (show: boolean) => void
  selectedProduct: object | null
  getData: () => Promise<void>
}

const Images: React.FC<ImagesProps> = ({ selectedProduct, setSelectedProduct, setShowProductForm, getData }) => {
  const [showPreview, setShowPreview] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<string[]>(selectedProduct?.images || [])
  const dispatch = useDispatch()
  const upload = async () => {
    try {
      if (!file || !selectedProduct || !('_id' in selectedProduct)) {
        message.error('File or product information is missing')
        return
      }
      dispatch(SetLoader(true))
      const payload: ImageUploadPayload = {
        file: file,
        productId: (selectedProduct as any)._id
      }
      const response = await UploadProductImage(payload)
      dispatch(SetLoader(false))
      if (response.success) {
        message.success(response.message)
        setImages([...images, response?.data])
        setShowPreview(false)
        setFile(null)
        getData()
        setShowProductForm(false)
      } else {
        message.error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  return (
    <div>
      <Upload
        listType='picture'
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info?.file)
          setShowPreview(true)
        }}
        showUploadList={showPreview}
      >
        <div className='flex gap-5 mb-5'>
          {images?.map((image) => {
            return (
              <div className='flex gap-2 border border-solid border-gray-300 rounded items-end p-3 p-5'>
                <img src={image} alt='' className='h-20 w-20 object-cover' />
                <i className='ri-delete-bin-2-line hover:cursor-pointer ' onClick={() => {}}></i>
              </div>
            )
          })}
        </div>
        <Button type='dashed'>Upload Image</Button>
      </Upload>

      <div className='flex justify-end gap-5 mt-5'>
        <Button
          type='default'
          onClick={() => {
            setShowProductForm(false)
          }}
        >
          Cancel
        </Button>

        <Button type='primary' onClick={upload} disabled={!file}>
          Upload Image
        </Button>
      </div>
    </div>
  )
}

export default Images