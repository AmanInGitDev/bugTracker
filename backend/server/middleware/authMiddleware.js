// server/middleware/authMiddleware.js
const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key (adjust as needed)
const serviceAccountPath = path.join(__dirname, '../../config/firebase-service-account.json');

// Initialize Firebase Admin
try {
  const serviceAccount = require(serviceAccountPath);
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  throw new Error('Failed to initialize Firebase Admin SDK');
}

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;