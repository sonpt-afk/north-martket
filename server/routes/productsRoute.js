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
router.post('/get-products', async(req,res) => {
  try {
    const { seller, category = [], age = [], status, search } = req.body
    let filters = {}
    
    if (seller) {
      filters.seller = seller
    }
    if (status) {
      filters.status = status
    }
    if (category?.length > 0) {
      filters.category = { $in: category }
    }
    if (search) {
      filters.name = { $regex: search, $options: 'i' }
    }

    const products = await Product.find(filters)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })

    res.send({
      success: true,
      data: products
    })
  } catch(error) {
    res.send({
      success: false,
      message: error.message 
    })
  }
})

//get product by id
router.get("/get-product-by-id/:id", async(req,res)=>{
  try{
    const product = await Product.findById(req.params.id).populate("seller");
    res.send({
      success: true,
      data: product
    });
  }catch (error) {
    res.send({
            success: false,
        message: error?.message
    })
}
})

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

//update product status
router.put("/update-product-status/:id", authMiddleware, async(req,res)=>{
    try{
        await Product.findByIdAndUpdate(req.params.id, {status: req.body.status});
        res.send({
            success: true,
            message: "Product status updated successfully"
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