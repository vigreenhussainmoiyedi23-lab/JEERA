const userModel = require('./src/models/user.model');
const mongoose = require('mongoose');

async function testSearch() {
  try {
    // Connect to DB
    await mongoose.connect('mongodb://localhost:27017/jeera');
    console.log('Connected to MongoDB');
    
    // Search for users with 'shabbir' in username
    const users = await userModel.find({
      username: { $regex: 'shabbir', $options: 'i' }
    }).select('username profilePic headline followersCount').lean();
    
    console.log('Found users for "shabbir":', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    // Also check all users to see what exists
    const allUsers = await userModel.find().select('username').limit(10).lean();
    console.log('All users in DB:', allUsers.map(u => u.username));
    
    // Test search for other common names
    const testNames = ['admin', 'user', 'test', 'john', 'shabbir'];
    for (const name of testNames) {
      const results = await userModel.find({
        username: { $regex: name, $options: 'i' }
      }).select('username').limit(3).lean();
      console.log(`Search for "${name}": ${results.length} users - ${results.map(u => u.username).join(', ')}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testSearch();
