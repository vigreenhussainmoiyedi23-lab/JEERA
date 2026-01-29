const userModel = require('./src/models/user.model');
const mongoose = require('mongoose');

async function checkAllDatabases() {
  try {
    // Connect to DB
    await mongoose.connect('mongodb://localhost:27017/jeera');
    console.log('Connected to MongoDB');
    
    // Check JEERA database
    const jeeraUsers = await mongoose.connection.db.collection('users').countDocuments();
    console.log('Users in JEERA database:', jeeraUsers);
    
    if (jeeraUsers > 0) {
      const users = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
      console.log('Sample users from JEERA:', users.map(u => ({ username: u.username, email: u.email })));
    }
    
    // Check BACKEND database
    const backendDb = mongoose.connection.useDb('BACKEND');
    const backendUsers = await backendDb.collection('users').countDocuments();
    console.log('Users in BACKEND database:', backendUsers);
    
    if (backendUsers > 0) {
      const users = await backendDb.collection('users').find({}).limit(5).toArray();
      console.log('Sample users from BACKEND:', users.map(u => ({ username: u.username, email: u.email })));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkAllDatabases();
