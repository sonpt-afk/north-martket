const router= require('express').Router();
const Product = require('../models/productModel');

const authMiddleware = require('../middlewares/authMiddleware');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
router.delete("/delete-product/:id", authMiddleware, async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Product deleted successfully" 
        })
    } catch (error) {
        res.send({
                success: false,
            message: error?.message
        })
    }
})

//edit a product
router.put("/edit-product/:id", authMiddleware, async(req,res)=>{
    try{
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success: true,
            message: "Product updated successfully"
        })
    }catch (error) {
        res.send({
                success: false,
            message: error.message
        })
    }
})

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const uploadMiddleware = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
  
  router.post(
    '/upload-image-to-product',
    authMiddleware,
    uploadMiddleware.single('file'),
    async (req, res) => {
      try {
        if (!req.file) {
          throw new Error('No file uploaded');
        }
  
        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);
  
        await Product.findByIdAndUpdate(req.body.productId, {
          $push: { images: result.secure_url },
        });
  
        res.send({
          success: true,
          message: "Image uploaded successfully",
          data: result?.secure_url
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message
        });
      }
    }
  );

module.exports = router;