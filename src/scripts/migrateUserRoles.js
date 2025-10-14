const mongoose = require('mongoose');
// Use __dirname to build absolute path
const User = require(__dirname + '/../models/User'); // 👈 relative to script location

require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const result = await User.updateMany(
      { role: 'employer' },
      {
        $set: {
          role: 'supporter',
          supporterType: 'employer'
        }
      }
    );

    console.log(`✅ Migrated ${result.modifiedCount} user(s)`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrate();