require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://okoyedann:${password}@cluster0.7i9u8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function saveFeedback(userId, feedback) {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Here we use 'sendoverDB' for the database name and 'feedbacks' for the collection
    const db = client.db("sendoverDB");
    const collection = db.collection("feedbacks");

    const feedbackEntry = {
      userId: userId,
      feedback: feedback,
      timestamp: new Date(),
    };

    // Insert feedback, which will create both the database and collection if they don't exist
    await collection.insertOne(feedbackEntry);
    console.log("Feedback saved:", feedbackEntry);
  } catch (error) {
    console.error("Failed to save feedback:", error);
  } finally {
    await client.close();
  }
}

module.exports = { saveFeedback };
