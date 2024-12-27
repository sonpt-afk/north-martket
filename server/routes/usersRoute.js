const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware  = require('../middlewares/authMiddleware');

//new user registration
router.post('/register',async(req,res) =>{
    try{
        //check if user already exists
        const user = await User.findOne({email: req.body.email});
        if(user){
            
            throw new Error('User already exists')     
            
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        //save user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: 'User registered successfully'
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
})

//user login
router.post('/login', async(req,res) =>{
    try{
        //check if user exists
        const user = await User.findOne({email: req.body.email});
        if(!user){
            throw new Error('User not found');
        }
        //compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            throw new Error('Incorrect password');
        }

        //create and assign token
        const token = jwt.sign({userId: user._id}, process.env.jwt_secret, {expiresIn: '1h'});

        //send response
        res.send({
            success: true,
            message: 'Login successful',
            data: token
        })
    }catch(error){
        res.send({
            success: false,
            message: error.message
        })
    }
})

//get current user
router.get('/get-current-user',authMiddleware, async(req,res) =>{
    try{
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: 'user fetched successfully',
            data: user
        })
       
    }catch(error){
        res.send({
            success: false,
            message: error.message
        })
    }
})



module.exports = router;