import initDatabase from './config/init-db.js';

// Initialize database when server starts
initDatabase().then(() => {
  console.log('Database initialization completed');
}).catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});