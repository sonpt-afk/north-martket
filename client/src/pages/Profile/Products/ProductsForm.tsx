import React from 'react'
import { Input, Modal, Tabs, Form, Col, Row, message, Checkbox, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { SetLoader } from '../../../redux/loadersSlice'
import { AddProduct } from '../../../apicalls/products'

interface ProductsFormProps {
  showProductForm: boolean
  setShowProductForm: (show: boolean) => void
}

const addtionalThings = [
  {
    label: 'Bill Available',
    name: 'billAvailable'
  },
  {
    label: 'Warranty Available',
    name: 'warrantyAvailable'
  },
  {
    label: 'Accessories Available',
    name: 'accessoriesAvailable'
  },
  {
    label: 'Box Available',
    name: 'boxAvailable'
  }
]

const rules = [{ required: true, message: 'Required' }]
const categories = ['Electronics', 'Home', 'Fashion', 'Sports', 'Books', 'Others']

const ProductsForm: React.FC<ProductsFormProps> = ({ showProductForm, setShowProductForm }) => {
  const formRef = React.useRef(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.users)

  const onFinish = async (values: Record<string, any>) => {
    try {
      if (!user?._id) {
        message.error('User not authenticated')
        return
      }

      values.seller = user._id
      values.status = 'pending'
      dispatch(SetLoader(true))
      const response = await AddProduct(values)
      dispatch(SetLoader(false))

      if (response.success) {
        message.success(response.message)
        setShowProductForm(false)
      } else {
        message.error(response.message)
      }
    } catch (error: any) {
      dispatch(SetLoader(false))
      message.error(error.message || 'An error occurred')
    }
  }

  return (
    <Modal
      open={showProductForm}
      title=''
      onCancel={() => setShowProductForm(false)}
      centered
      width={800}
      okText='Save'
      onOk={() => {
        formRef.current?.submit()
      }}
      className='h-screen	'
    >
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane tab='General' key='1'>
          <div className='max-h-[60vh] overflow-y-scroll '>
            <Form
              layout='vertical'
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                category: categories[0] // Set default value
              }}
            >
              <Form.Item label='Name' name='name' rules={rules}>
                <Input type='text' />
              </Form.Item>
              <Form.Item label='Description' name='description' rules={rules}>
                <Input.TextArea />
              </Form.Item>

              <Row className='sm:flex-col xs:flex-col'>
                <Col xl={8} lg={8} xs={24} sm={24} md={8}>
                  <Form.Item label='Price' name='price' rules={rules}>
                    <Input type='number' />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} xs={24} sm={24} md={8}>
                  <Form.Item label='Category' name='category' rules={rules}>
                    <Select defaultValue={categories[0]}>
                      {categories.map((category) => (
                        <Select.Option key={category} value={category}>
                          {category}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} xs={24} sm={24} md={8}>
                  <Form.Item label='Age' name='age' rules={rules}>
                    <Input type='number' />
                  </Form.Item>
                </Col>
              </Row>

              <div className=''>
                {addtionalThings.map((item) => (
                  <Form.Item
                    key={item.name}
                    name={item.name}
                    valuePropName='checked'
                    className='flex items-center gap-2 mb-2'
                  >
                    <div className='flex items-center space-x-2'>
                      <Checkbox />
                      <span>{item.label}</span>
                    </div>
                  </Form.Item>
                ))}
              </div>
            </Form>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Images' key='2'>
          Content of Tab Pane 2
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}

export default ProductsForm
