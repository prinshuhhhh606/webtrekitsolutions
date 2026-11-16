const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async () => {
  try {
    const Admin = require('./models/Admin');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('[Auto-Seed] Initial database empty. Running initial seeder...');
      const { seedDB } = require('./utils/seed');
      if (typeof seedDB === 'function') seedDB();
    }
  } catch (err) {
    // Database might not be initialized yet
  }
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 Webtrek IT Solutions Backend Server Running`);
  console.log(`  📁 MVC Architecture: backend/src/`);
  console.log(`  📍 Port: http://localhost:${PORT}`);
  console.log(`  🛠️ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection Error]: ${err.message}`);
});

process.on('uncaughtException', (err) => {
  console.error(`[UncaughtException Error]: ${err.message}`);
});

