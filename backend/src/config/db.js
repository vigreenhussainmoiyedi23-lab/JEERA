const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        
        // If SSL error, provide helpful message
        if (error.message.includes('SSL') || error.message.includes('tls')) {
            console.log('💡 SSL Connection Tips:');
            console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
            console.log('2. Verify your MongoDB URI includes correct database name');
            console.log('3. Ensure your MongoDB user has proper permissions');
            console.log('4. Check if you\'re using the correct connection string format');
        }
        
        process.exit(1);
    }
}

module.exports = connectDB;