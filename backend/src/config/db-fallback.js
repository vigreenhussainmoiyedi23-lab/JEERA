const mongoose = require('mongoose');

async function connectDBFallback() {
    try {
        console.log('🔄 Attempting MongoDB connection with fallback options...');
        
        // Try with relaxed SSL settings first
        const fallbackOptions = {
            ssl: true,
            sslValidate: false, // Allow invalid certificates for testing
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5,
            minPoolSize: 2,
            retryWrites: false, // Disable retry writes for testing
            w: 1 // Use write concern 1 for testing
        };

        await mongoose.connect(process.env.MONGO_URI, fallbackOptions);
        console.log('✅ MongoDB connected with fallback options');
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('📊 MongoDB connected to:', mongoose.connection.name);
            console.log('⚠️  Using fallback SSL settings - consider fixing for production');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ MongoDB fallback connection failed:', error.message);
        
        // Try without SSL as last resort
        try {
            console.log('🔄 Attempting connection without SSL...');
            const noSSLOptions = {
                ssl: false,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 30000,
                maxPoolSize: 3,
                retryWrites: false
            };

            await mongoose.connect(process.env.MONGO_URI.replace('mongodb+srv://', 'mongodb://'), noSSLOptions);
            console.log('✅ MongoDB connected without SSL (not recommended for production)');
            
        } catch (noSSLError) {
            console.error('❌ All MongoDB connection attempts failed');
            console.log('💡 Final troubleshooting steps:');
            console.log('1. Check your MongoDB Atlas cluster status');
            console.log('2. Verify your MONGO_URI environment variable');
            console.log('3. Whitelist your IP address in MongoDB Atlas');
            console.log('4. Check database user credentials');
            console.log('5. Ensure cluster is not paused/suspended');
            
            process.exit(1);
        }
    }
}

module.exports = connectDBFallback;
