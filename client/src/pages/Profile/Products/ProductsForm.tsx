import React, { useEffect, useState } from 'react'
import { Input, Modal, Tabs, Form, Col, Row, message, Checkbox, Select, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { SetLoader } from '../../../redux/loadersSlice'
import { AddProduct, EditProduct } from '../../../apicalls/products'
import Images from './Images'

interface ProductsFormProps {
  showProductForm: boolean
  setShowProductForm: (show: boolean) => void
  selectedProduct: object | null
  getData: () => Promise<void>
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

const ProductsForm: React.FC<ProductsFormProps> = ({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData
}) => {
  const [form] = Form.useForm()
  const [selectedTab = '1', setSelectedTab] = useState<string | undefined>('1')
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.users)

  const onFinish = async (values: Record<string, any>) => {
    try {
      dispatch(SetLoader(true))
      let response = null
      if (selectedProduct) {
        response = await EditProduct(selectedProduct?._id, values)
      } else {
        values.seller = user?._id
        values.status = 'pending'
        response = await AddProduct(values)
      }
      dispatch(SetLoader(false))
      if (response?.success) {
        message.success(response.message)
        getData()
        setShowProductForm(false)
      } else {
        message.error(response.message)
      }
    } catch (error: any) {
      dispatch(SetLoader(false))
      message.error(error.message || 'An error occurred')
    }
  }

  useEffect(() => {
    if (selectedProduct) {
      const formValues = {
        ...selectedProduct,
        billAvailable: Boolean(selectedProduct?.billAvailable),
        warrantyAvailable: Boolean(selectedProduct?.warrantyAvailable),
        accessoriesAvailable: Boolean(selectedProduct?.accessoriesAvailable),
        boxAvailable: Boolean(selectedProduct?.boxAvailable),
        showBidsOnProductPage: Boolean(selectedProduct?.showBidsOnProductPage)
      }
      form.setFieldsValue(formValues)
    }
  }, [selectedProduct, form])

  return (
    <Modal
      open={showProductForm}
      title=''
      onCancel={() => setShowProductForm(false)}
      centered
      width={800}
      className='h-screen	'
      footer={selectedTab === '2' && null}
      {...(selectedTab === '2' && { footer: false })}
    >
      <div>
        <h1 className='text-primary text-xl text-center font-semibold'>
          {selectedProduct ? 'Edit Product' : 'Add Product'}
        </h1>
        <Tabs defaultActiveKey='1' activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
          <Tabs.TabPane tab='General' key='1'>
            <div className='max-h-[60vh] overflow-y-scroll '>
              <Form
                layout='vertical'
                form={form}
                onFinish={onFinish}
                initialValues={{
                  category: categories[0],
                  billAvailable: false,
                  warrantyAvailable: false,
                  accessoriesAvailable: false,
                  boxAvailable: false,
                  showBidsOnProductPage: false
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

                <div className='flex gap-10 mb-5'>
                  {addtionalThings.map((item) => (
                    <Form.Item
                      key={item.name}
                      name={item.name}
                      valuePropName='checked'
                      className='flex items-center gap-2 mb-2'
                    >
                      <div className='flex flex-col gap-3 items-center space-x-2'>
                        <Checkbox defaultChecked={selectedProduct?.[item.name]}>{item.label}</Checkbox>
                      </div>
                    </Form.Item>
                  ))}
                </div>

                <Row>
                  <Col span={8}>
                    <Form.Item
                      name='showBidsOnProductPage'
                      valuePropName='checked'
                      className='flex items-center gap-2 mb-2'
                    >
                      <Checkbox>Show Bids on Product Page</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab='Images' key='2' disabled={!selectedProduct}>
            <Images
              selectedProduct={selectedProduct}
              getData={getData}
              setShowProductForm={setShowProductForm}
            ></Images>
          </Tabs.TabPane>
        </Tabs>
        {selectedTab === '1' && (
          <div className='flex justify-end gap-4 mt-4 pt-4 border-t'>
            <Button size='large' onClick={() => setShowProductForm(false)} className='min-w-[100px]'>
              Cancel
            </Button>
            <Button type='primary' size='large' onClick={() => form.submit()} className='min-w-[100px]'>
              {selectedProduct ? 'Update' : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ProductsForm
