import { Form, Input, message, Modal } from 'antd'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../redux/loadersSlice'
import { PlaceNewBid } from '../../apicalls/products'

interface BidModalProps {
  showBidModal: boolean
  setShowBidModal: (show: boolean) => void
  product: { _id: string; seller: { _id: string } }
  reloadData: () => void
}

const BidModal: React.FC<BidModalProps> = ({ showBidModal, setShowBidModal, product, reloadData }) => {
  const formRef = useRef(null)
  const rules = [{ required: true, message: 'Required' }]
  const dispatch = useDispatch()
  const { user } = useSelector((state: any) => state.users)

  const onFinish = async (values: any) => {
    try {
      dispatch(SetLoader(true))
      const response = await PlaceNewBid({
        ...values,
        product: product?._id,
        seller: product?.seller?._id,
        buyer: user?._id
      })
      dispatch(SetLoader(false))
      if (response.success) {
        message.success('Place bid successfully')
        reloadData()
        setShowBidModal(false)
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      message.error(error.message)
      dispatch(SetLoader(false))
    }
  }
  return (
    <Modal
      centered
      onCancel={() => setShowBidModal(false)}
      open={showBidModal}
      width={800}
      onOk={() => formRef.current.submit()}
    >
      <div className='flex flex-col gap-5'>
        <h1 className='text-2xl text-gray-500 font-semibold text-center'>Place A New Bid</h1>

        <Form layout='vertical' ref={formRef} onFinish={onFinish}>
          <Form.Item label='Bid Amount' name='bidAmount' rules={rules}>
            <Input></Input>
          </Form.Item>
          <Form.Item label='Message' name='message' rules={rules}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label='Mobile' name='mobile' rules={rules}>
            <Input type='number' />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default BidModal
