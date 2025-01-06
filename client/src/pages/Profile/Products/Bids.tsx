import { message, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { GetAllBids } from '../../../apicalls/products'
import { SetLoader } from '../../../redux/loadersSlice'
import moment from 'moment'
import { text } from 'stream/consumers'
import { data } from 'react-router-dom'
import { render } from 'react-dom'

interface BidProps {
  setShowBidModal: (show: boolean) => void
  showBidModal: boolean
  selectedProduct: object | null
}
const Bids: React.FC<BidProps> = ({ showBidModal, setShowBidModal, selectedProduct }) => {
  const [bidsData, setBidsData] = useState([])
  const dispatch = useDispatch()
  const getData = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetAllBids({ product: selectedProduct?._id })
      dispatch(SetLoader(false))
      if (response.success) {
        setBidsData(response.data)
        console.log(response.data)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error?.message)
    }
  }

  useEffect(() => {
    if (selectedProduct) {
      getData()
    }
  }, [selectedProduct])
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      render: (text, record) => {
        return record?.buyer?.name
      }
    },
    { title: 'Bid Amount', dataIndex: 'bidAmount', align: 'center' },
    {
      title: 'Bid Date',
      dataIndex: 'createdAt',
      align: 'center',
      render: (record) => {
        return moment(record).format('DD/MM/YYYY, h:mm:ss a')
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
    <Modal footer={null} title='Bids' open={showBidModal} onCancel={() => setShowBidModal(false)} centered width={800}>
      <h1 className='text-xl text-primary font-semibold'>Product name: {selectedProduct?.name}</h1>
      <Table columns={columns} dataSource={bidsData}></Table>
    </Modal>
  )
}

export default Bids
