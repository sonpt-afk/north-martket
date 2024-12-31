const router= require('express').Router();
const Product = require('../models/productModel');

const authMiddleware = require('../middlewares/authMiddleware');

//add a new product
router.post('/add-product',authMiddleware,async(req,res)=>{
    try{
        const newProduct = new Product(req.body)
            await newProduct.save()
            res.send({
                success: true,
                message: 'Product added successfully',
            })
    }catch(error){
        res.send({
            success: false,
            message: error.message 
        })
    }
});

//get all products
router.get('/get-products',async(req,res)=>{
    try{
        const products = await Product.find().sort({createdAt: -1});
        res.send({
            success: true,
            products: products
        })
    }catch(error){
        res.send({
            success: false,
            message: error.message 
        })
    }
});

//delete a product
router.post("/delete-product/:id", authMiddleware, async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Product deleted successfully" 
        })
    } catch (error) {
        res.send({
                success: false,
            message: error.message
        })
    }
})

module.exports = router;