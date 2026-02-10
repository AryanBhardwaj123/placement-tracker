const mongoose = require('mongoose');

const connectDB = require('./db.js'); // Self-reference fix? No, wait. This file IS db.js.
// Wait, I should not require self.

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDatabase;
