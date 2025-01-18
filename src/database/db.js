
const admin = require('firebase-admin');
const serviceAccount = require('../config/foodie-backend-f493a-firebase-adminsdk-q8owh-4580b9984c.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


const db = admin.firestore();

module.exports = db;