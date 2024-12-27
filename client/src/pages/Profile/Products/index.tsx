import { Button, message, Table } from 'antd'
import React, { useEffect } from 'react'
import ProductsForm from './ProductsForm'
import { data } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { SetLoader } from '../../../redux/loadersSlice'
import { GetProduct } from '../../../apicalls/products'

const Products = () => {
  const [showProductForm,setShowProductForm] = React.useState(false)
  const [products,setProducts] = React.useState([])
    const dispatch = useDispatch()
    const getData = async () => {
      try{
        dispatch(SetLoader(true))
        const response = await GetProduct();
        console.log('response',response)
        dispatch(SetLoader(false))
        if(response.success){
          setProducts(response.products)
      }
      
    }catch(error){
      dispatch(SetLoader(false      ));
      message.error(error.message)
    }
  }

  useEffect(() => {
    getData()
  },[])


    const columns=[
    {title:"Name",
      dataIndex:"name",
    },
    {title:"Description",
      dataIndex:"description",
    },
    {title:"Price",
      dataIndex:"price",
    },
    {title:"Category",
      dataIndex:"category",
    },
    {title:"Age",
      dataIndex:"age",
    },
    {title:"Status",
      dataIndex:"status",
    },
  ]
  return (
    <div>
      <div className="flex  justify-end">
        <Button type='default' onClick={() => setShowProductForm(true)}>
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products}></Table>
    {showProductForm && <ProductsForm showProductForm={showProductForm} setShowProductForm={setShowProductForm} />
    }
    </div>
  )
}

export default Products