const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'sendoverDB';
const collectionName = 'feedback';

async function saveFeedback(userId, feedback) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const feedbackEntry = {
      userId: userId,
      feedback: feedback,
      timestamp: new Date(),
    };

    await collection.insertOne(feedbackEntry);
    console.log("Feedback saved:", feedbackEntry);
  } catch (error) {
    console.error("Failed to save feedback:", error);
  } finally {
    await client.close();
  }
}

module.exports = { saveFeedback };
