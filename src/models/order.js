const mongoose = require("mongoose");

// Define the schema for the "orders" collection
const orderSchema = new mongoose.Schema({
    userId: { type: Number, required: true }, // Telegram user ID
    packageName: { type: String, required: true },
    trackingId: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["processing", "processed", "shipping", "in transit", "delivered"], 
        default: "processing" 
    },
    createdAt: { type: Date, default: Date.now }
});

// Link the schema to the "orders" collection
const Order = mongoose.model("Order", orderSchema);

// Export the model
module.exports = Order;
