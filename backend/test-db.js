require("dotenv").config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📋 MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'NOT SET');
    
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is not set in .env file');
        return;
    }

    try {
        // Test with minimal options first
        console.log('🔄 Attempting basic connection...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Basic connection successful!');
        
        // Test database operations
        console.log('🔄 Testing database operations...');
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📊 Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        
        // Try with SSL disabled
        if (error.message.includes('SSL') || error.message.includes('ssl')) {
            console.log('🔄 Trying without SSL...');
            try {
                await mongoose.connect(process.env.MONGO_URI.replace('mongodb+srv://', 'mongodb://'), {
                    ssl: false
                });
                console.log('✅ Connection successful without SSL');
                await mongoose.disconnect();
            } catch (sslError) {
                console.error('❌ Also failed without SSL:', sslError.message);
            }
        }
    }
}

testConnection();
