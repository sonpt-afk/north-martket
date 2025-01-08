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
        // if user is inactive
        if(user?.status !== 'active'){
            throw new Error("User account is blocked, please contact admin")
        }
        //compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            throw new Error('Incorrect password');
        }

        //create and assign token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

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

//get all users
router.get('/get-users',authMiddleware, async(req,res) =>{
    try{
        const users = await User.find();
        res.send({
            success: true,
            message: 'users fetched successfully',
            data: users
        })
    }catch(error){
        res.send({
            success: false,
            message: error.message
        })
    }
})

//update users status
router.put('/update-user-status/:id',authMiddleware, async(req,res) =>{
    try{
        await User.findByIdAndUpdate(req.params.id, {status: req.body.status});
        res.send({
            success: true,
            message: 'User status updated successfully'
        })
    }catch(error){
        res.send({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;