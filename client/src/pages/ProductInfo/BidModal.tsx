import { Form, Input, message, Modal } from 'antd'
import { useOptimistic, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../redux/loadersSlice'
import { PlaceNewBid } from '../../apicalls/products'
import { AddNotification } from '../../apicalls/notifications'

interface BidModalProps {
  showBidModal: boolean
  setShowBidModal: (show: boolean) => void
  product: { _id: string; seller: { _id: string }; name?: string }
  reloadData: () => void
}

interface BidState {
  bidAmount: string
  status: 'idle' | 'pending' | 'success' | 'error'
}

const BidModal = ({ showBidModal, setShowBidModal, product, reloadData }: BidModalProps) => {
  const [form] = Form.useForm()
  const rules = [{ required: true, message: 'Required' }]
  const dispatch = useDispatch()
  const { user } = useSelector((state: any) => state.users)
  const [isPending, startTransition] = useTransition()

  // Optimistic state for better UX during bid placement
  const [optimisticState, setOptimisticState] = useOptimistic<BidState, Partial<BidState>>(
    { bidAmount: '', status: 'idle' },
    (state, newState) => ({ ...state, ...newState })
  )

  const onFinish = async (values: any) => {
    startTransition(async () => {
      try {
        // Optimistically update UI to show pending state
        setOptimisticState({ bidAmount: values.bidAmount, status: 'pending' })
        dispatch(SetLoader(true))

        const response = await PlaceNewBid({
          ...values,
          product: product?._id,
          seller: product?.seller?._id,
          buyer: user?._id
        })
        dispatch(SetLoader(false))

        if (response.success) {
          setOptimisticState({ status: 'success' })
          message.success('Bid placed successfully')

          await AddNotification({
            title: 'New Bid',
            message: `A new bid of $${values.bidAmount} has been placed on ${product?.name}`,
            user: product?.seller?._id,
            onClick: `/profile`,
            read: false
          })
          reloadData()
          setShowBidModal(false)
        } else {
          setOptimisticState({ status: 'error' })
          throw new Error(response.message)
        }
      } catch (error: any) {
        message.error(error.message)
        dispatch(SetLoader(false))
        setOptimisticState({ status: 'error' })
      }
    })
  }

  return (
    <Modal
      centered
      onCancel={() => setShowBidModal(false)}
      open={showBidModal}
      width={800}
      onOk={() => form.submit()}
      okText={optimisticState.status === 'pending' ? 'Placing Bid...' : 'Place Bid'}
      okButtonProps={{
        loading: isPending || optimisticState.status === 'pending',
        disabled: isPending || optimisticState.status === 'pending'
      }}
      cancelButtonProps={{
        disabled: isPending || optimisticState.status === 'pending'
      }}
    >
      <div className='flex flex-col gap-5'>
        <h1 className='text-2xl text-gray-500 font-semibold text-center'>Place A New Bid</h1>

        <Form layout='vertical' form={form} onFinish={onFinish}>
          <Form.Item label='Bid Amount' name='bidAmount' rules={rules}>
            <Input disabled={isPending || optimisticState.status === 'pending'} />
          </Form.Item>
          <Form.Item label='Message' name='message' rules={rules}>
            <Input.TextArea disabled={isPending || optimisticState.status === 'pending'} />
          </Form.Item>
          <Form.Item label='Mobile' name='mobile' rules={rules}>
            <Input type='number' disabled={isPending || optimisticState.status === 'pending'} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default BidModal
