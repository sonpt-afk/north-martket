import { useEffect, useState, useOptimistic, useTransition } from 'react'
import { Input, Modal, Tabs, Form, Col, Row, message, Checkbox, Select, Button, Card, Tag, Progress, Tooltip, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { SetLoader } from '../../../redux/loadersSlice'
import { AddProduct, EditProduct } from '../../../apicalls/products'
import { GetProduct } from '../../../apicalls/products'
import Images from './Images'
import { getWritingAssistant, WritingAnalysis } from '../../../utils/aiWritingAssistant'
import { getPriceEngine, PriceSuggestion } from '../../../utils/aiPriceSuggestion'

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

interface ProductFormState {
  name: string
  status: 'idle' | 'pending' | 'success' | 'error'
  operation: 'add' | 'edit' | null
}

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
  const [isPending, startTransition] = useTransition()

  // AI Features State
  const [descriptionAnalysis, setDescriptionAnalysis] = useState<WritingAnalysis | null>(null)
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null)
  const [showAIHelp, setShowAIHelp] = useState(true)

  // Optimistic state for better UX during product operations
  const [optimisticState, setOptimisticState] = useOptimistic<ProductFormState, Partial<ProductFormState>>(
    { name: '', status: 'idle', operation: null },
    (state, newState) => ({ ...state, ...newState })
  )

  const onFinish = async (values: Record<string, any>) => {
    startTransition(async () => {
      try {
        // Optimistically update UI
        const operation = selectedProduct ? 'edit' : 'add'
        setOptimisticState({
          name: values.name,
          status: 'pending',
          operation
        })
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
          setOptimisticState({ status: 'success' })
          message.success(response.message)
          getData()
          setShowProductForm(false)
        } else {
          setOptimisticState({ status: 'error' })
          message.error(response.message)
        }
      } catch (error: any) {
        dispatch(SetLoader(false))
        setOptimisticState({ status: 'error' })
        message.error(error.message || 'An error occurred')
      }
    })
  }

  // AI Writing Assistant - analyze description as user types
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const category = form.getFieldValue('category')

    if (text.length > 0) {
      const assistant = getWritingAssistant()
      const analysis = assistant.analyzeDescription(text, category)
      setDescriptionAnalysis(analysis)
    } else {
      setDescriptionAnalysis(null)
    }
  }

  // AI Price Suggestion - generate when category changes
  const handleCategoryChange = async (category: string) => {
    try {
      const response = await GetProduct({ status: 'approved' })
      if (response.success) {
        const priceEngine = getPriceEngine(response.data)
        const suggestion = priceEngine.suggestPrice('', category)
        setPriceSuggestion(suggestion)
      }
    } catch (error) {
      console.error('Failed to generate price suggestion:', error)
    }
  }

  // Apply suggested price
  const applySuggestedPrice = () => {
    if (priceSuggestion) {
      form.setFieldValue('price', priceSuggestion.suggestedPrice)
      message.success('Price suggestion applied!')
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

      // Analyze existing description
      if (selectedProduct?.description) {
        const assistant = getWritingAssistant()
        const analysis = assistant.analyzeDescription(
          selectedProduct.description,
          selectedProduct.category
        )
        setDescriptionAnalysis(analysis)
      }
    } else {
      // Generate price suggestion for new products
      handleCategoryChange(categories[0])
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
        {showAIHelp && (
          <Alert
            message={
              <div className='flex items-center gap-2'>
                <i className="ri-sparkling-fill text-blue-500" />
                <span>AI-Powered Features Active</span>
              </div>
            }
            description="Get smart suggestions for pricing and writing better product descriptions"
            type="info"
            showIcon={false}
            closable
            onClose={() => setShowAIHelp(false)}
            className='mb-3'
          />
        )}
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
                  <Input.TextArea
                    rows={4}
                    onChange={handleDescriptionChange}
                    placeholder='Describe your product in detail...'
                  />
                </Form.Item>

                {/* AI Writing Assistant Feedback */}
                {showAIHelp && descriptionAnalysis && (
                  <Card
                    size='small'
                    className='mb-4 border-blue-200 bg-blue-50'
                    title={
                      <div className='flex items-center gap-2'>
                        <i className="ri-sparkling-line text-blue-500" />
                        <span>AI Writing Assistant</span>
                        <Tag color={descriptionAnalysis.score >= 80 ? 'green' : descriptionAnalysis.score >= 60 ? 'orange' : 'red'}>
                          Score: {descriptionAnalysis.score}/100
                        </Tag>
                      </div>
                    }
                    extra={
                      <Button
                        type='text'
                        size='small'
                        onClick={() => setShowAIHelp(false)}
                        icon={<i className="ri-close-line" />}
                      />
                    }
                  >
                    <div className='space-y-2'>
                      <Progress
                        percent={descriptionAnalysis.score}
                        status={descriptionAnalysis.score >= 80 ? 'success' : 'active'}
                        strokeColor={descriptionAnalysis.score >= 80 ? '#52c41a' : '#1890ff'}
                      />
                      {descriptionAnalysis.suggestions.length > 0 && (
                        <div className='text-sm'>
                          <strong>Suggestions:</strong>
                          <ul className='list-disc pl-5 mt-1'>
                            {descriptionAnalysis.suggestions.map((suggestion, idx) => (
                              <li key={idx} className='text-gray-700'>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className='flex gap-4 text-xs text-gray-600'>
                        <span>{descriptionAnalysis.wordCount} words</span>
                        <span>•</span>
                        <span>Readability: {descriptionAnalysis.readabilityLevel}</span>
                      </div>
                    </div>
                  </Card>
                )}

                <Row className='sm:flex-col xs:flex-col'>
                  <Col xl={8} lg={8} xs={24} sm={24} md={8}>
                    <Form.Item label='Price' name='price' rules={rules}>
                      <Input type='number' prefix='$' />
                    </Form.Item>
                  </Col>
                  <Col xl={8} lg={8} xs={24} sm={24} md={8}>
                    <Form.Item label='Category' name='category' rules={rules}>
                      <Select
                        defaultValue={categories[0]}
                        onChange={handleCategoryChange}
                      >
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
                      <Input type='number' suffix='years' />
                    </Form.Item>
                  </Col>
                </Row>

                {/* AI Price Suggestion */}
                {showAIHelp && priceSuggestion && (
                  <Card
                    size='small'
                    className='mb-4 border-green-200 bg-green-50'
                    title={
                      <div className='flex items-center gap-2'>
                        <i className="ri-money-dollar-circle-line text-green-500" />
                        <span>AI Price Suggestion</span>
                        <Tag color={priceSuggestion.confidence === 'high' ? 'green' : priceSuggestion.confidence === 'medium' ? 'blue' : 'orange'}>
                          {priceSuggestion.confidence} confidence
                        </Tag>
                      </div>
                    }
                  >
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <div className='text-2xl font-bold text-green-600'>
                            ${priceSuggestion.suggestedPrice}
                          </div>
                          <div className='text-xs text-gray-500'>
                            Range: ${priceSuggestion.priceRange.min} - ${priceSuggestion.priceRange.max}
                          </div>
                        </div>
                        <Button
                          type='primary'
                          size='small'
                          onClick={applySuggestedPrice}
                          icon={<i className="ri-check-line" />}
                        >
                          Apply
                        </Button>
                      </div>

                      {priceSuggestion.reasoning.length > 0 && (
                        <div className='text-sm'>
                          <strong>Why this price?</strong>
                          <ul className='list-disc pl-5 mt-1'>
                            {priceSuggestion.reasoning.map((reason, idx) => (
                              <li key={idx} className='text-gray-700'>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className='flex gap-4 text-xs text-gray-600 pt-2 border-t border-green-200'>
                        <Tooltip title="Average price in this category">
                          <span>Avg: ${priceSuggestion.marketInsights.avgCategoryPrice.toFixed(2)}</span>
                        </Tooltip>
                        <span>•</span>
                        <Tooltip title="Average bids per product">
                          <span>{priceSuggestion.marketInsights.avgBidsPerProduct.toFixed(1)} bids/item</span>
                        </Tooltip>
                        <span>•</span>
                        <Tooltip title="Success rate in category">
                          <span>{(priceSuggestion.marketInsights.successRate * 100).toFixed(0)}% success</span>
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                )}

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
            <Button
              size='large'
              onClick={() => setShowProductForm(false)}
              className='min-w-[100px]'
              disabled={isPending || optimisticState.status === 'pending'}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              size='large'
              onClick={() => form.submit()}
              className='min-w-[100px]'
              loading={isPending || optimisticState.status === 'pending'}
              disabled={isPending || optimisticState.status === 'pending'}
            >
              {optimisticState.status === 'pending'
                ? `${optimisticState.operation === 'edit' ? 'Updating' : 'Saving'}...`
                : selectedProduct
                  ? 'Update'
                  : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ProductsForm
