const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json());

// Connect to database
require('./config/dbConfig');

// Load models
require('./models/userModel');
require('./models/productModel');

// Routes
const usersRoute = require('./routes/usersRoute');
const productsRoute = require('./routes/productsRoute');

app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});