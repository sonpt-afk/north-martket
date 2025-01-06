import { message, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice'
import { GetAllBids } from '../../../apicalls/products'

interface BidProps {
  setShowBidModal: (show: boolean) => void
  showBidModal: boolean
  selectedProduct: object | null
}
const UserBids: React.FC<BidProps> = ({ showBidModal, setShowBidModal, selectedProduct }) => {
  const [bidsData, setBidsData] = useState([])
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.users)
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetAllBids({
        buyer: user._id
      })
      dispatch(SetLoader(false))
      if (response.success) {
        setBidsData(response.data)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      align: 'center',
      render: (text, record) => {
        return record?.product?.name
      }
    },
    { title: 'Bid Amount', dataIndex: 'bidAmount', align: 'center' },
    {
      title: 'Seller',
      dataIndex: 'seller',
      align: 'center',
      render: (text, record) => {
        return record?.seller?.name
      }
    },
    {
      title: 'Offered Price',
      dataIndex: 'offerdprice',
      align: 'center',
      render: (text, record) => {
        return record?.product?.price
      }
    },

    {
      title: 'Message',
      dataIndex: 'message'
    },
    {
      title: 'Contact Details',
      dataIndex: 'contactDetails',
      render: (text, record) => {
        return (
          <div>
            <p>Phone: {record?.mobile}</p>
            <p>Email: {record?.buyer?.email}</p>
          </div>
        )
      }
    }
  ]
  return (
    <>
      <div className='flex flex-col gap-3'>
        <Table columns={columns} dataSource={bidsData}></Table>
      </div>
    </>
  )
}

export default UserBids
