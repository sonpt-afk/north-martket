const mongoose = require('mongoose');
const path = require('path');

if (!process.env.MONGO_URL) {
    console.error('MongoDB connection string is not defined in .env file');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

const connection = mongoose.connection;

connection.on('connected', () => console.log('Mongo Connection Established'));
connection.on('error', (err) => console.log('Mongo Connection Failed:', err.message));

module.exports = connection;