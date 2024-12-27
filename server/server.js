const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
// Load env vars BEFORE requiring dbConfig
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json());
const dbConfig = require('./config/dbConfig');

const port = process.env.PORT || 5000;

const usersRoute = require('./routes/usersRoute');
app.use('/api/users', usersRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});