import { Input, Modal, Tabs, Form, Col, Row, message } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { AddProduct } from '../../../apicalls/products';

interface ProductsFormProps {
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
}

const addtionalThings = [
  {
    label:"Bill Available",
    name: "billAvailable",
  },
  {
    label:"Warranty Available",
    name: "warrantyAvailable",
  },
  {
    label:"Accessories Available",
    name: "accessoriesAvailable",
  },
  {
    label:"Box Available",
    name: "boxAvailable",
  },
]

const rules=[
  {required: true,
  message: 'Required'
  }
]
const ProductsForm: React.FC<ProductsFormProps> = ({ showProductForm, setShowProductForm }) => {
  const formRef = React.useRef(null)
  const dispatch = useDispatch()
  // Update the user selector
const { user } = useSelector((state: RootState) => state.users);

// Add type safety to onfinish
const onfinish = async (values: any) => {
  try {
    if (!user?._id) {
      message.error('User not authenticated');
      return;
    }
    
    values.seller = user._id;
    values.status = "pending";
    dispatch(SetLoader(true));
    const response = await AddProduct(values);
    dispatch(SetLoader(false));

    if (response.success) {
      message.success(response.message);
      setShowProductForm(false);
    } else {
      message.error(response.message);
    }
  } catch (error) {
    dispatch(SetLoader(false));
    message.error(error.message);
  }
};
  return (
    <Modal
    open={showProductForm}
    title=""
    onCancel={() => setShowProductForm(false)}
    centered
    width={800}
    okText="Save"
    onOk={() => {
      formRef.current.submit()
    }}
    >
    <Tabs defaultActiveKey='1'>
    <Tabs.TabPane tab="General" key="1">
      <Form layout='vertical' ref={formRef}
      onFinish={onfinish}
      >
      <Form.Item
        label="Name" name="name" rules={rules}
        >
          <Input type='text'></Input>
        </Form.Item>
      <Form.Item
        label="Description" name="description" rules={rules}
        >
          <TextArea type='text'/>
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item label="Price" name="price" rules={rules}>
              <Input type='number'></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Category" name="category" rules={rules}>
              <select name="" id="">
                <option value="electronics">
                  Electronics
                </option>
                <option value="fashion">
                  Fashion 
                </option>
                <option value="home">
                  Home
                </option>
                <option value="sports">
                  Sports
                </option>
              </select>
            </Form.Item>
          </Col>

          <Col span={8}>
          <Form.Item label="Age" name="age" rules={rules}>
            <Input type="number"></Input>
          </Form.Item>
          </Col>

        </Row>
      <div className="flex gap-10">
        {addtionalThings.map((item) => (
          <Form.Item label={item.label} name={item.name}>
            <Input type='checkbox' value={item.name} 
            onChange={(e) => {
              formRef.current.setFieldsValue({
                [item.name]: e.target.checked
              })
            }}
            checked={formRef.current?.getFieldValue(item.name)}
            ></Input>
          </Form.Item>
        ))}
      </div>
      </Form>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Images" key="2">
      Content of Tab Pane 2
    </Tabs.TabPane>
      </Tabs>
    </Modal>

  )
}

export default ProductsForm