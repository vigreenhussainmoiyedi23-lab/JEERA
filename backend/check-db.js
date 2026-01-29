const userModel = require('./src/models/user.model');
const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    // Connect to DB
    await mongoose.connect('mongodb://localhost:27017/jeera');
    console.log('Connected to MongoDB');
    
    // Check total user count
    const totalUsers = await userModel.countDocuments();
    console.log('Total users in database:', totalUsers);
    
    if (totalUsers > 0) {
      // Get first few users
      const users = await userModel.find().select('username email').limit(5).lean();
      console.log('Sample users:', users);
    }
    
    // Check all databases
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    console.log('Available databases:', databases.databases.map(db => db.name));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDatabase();
