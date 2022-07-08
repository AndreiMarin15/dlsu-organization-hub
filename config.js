const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  envPort: process.env.PORT,
  dbURL: process.env.MONGODB_URL,
  sessionKey: process.env.SESSION_SECRET,
};
