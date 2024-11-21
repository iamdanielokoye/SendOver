const express = require('express');
const dotenv = require('dotenv');
const { Telegraf, Markup } = require('telegraf');
const mongoose = require("mongoose");
const axios = require('axios');
dotenv.config();

const { queryOpenRouter } = require("./ai/queryOpenRouter")
const { fallbackAIService } = require("./ai/fallbackAIService")
const { feedbackService } = require("./utils/feedbackService")
const { showPackages, handleOrder, dummyPackages } = require('./features/orderHandler');
const { getShipmentStatus } = require('./features/shipmentTracking');
const telegramBot = require('./bot/telegramBot');
const { trackShipment } = require('./features/shipmentTracking');
const { processPayment } = require('./payment/paymentProcessing');

const app = express();
const port = process.env.PORT || 3000;

// Endpoint for shipment tracking
app.get('/track/:serialNumber', async (req, res) => {
  const serialNumber = req.params.serialNumber;
  const trackingInfo = await trackShipment(serialNumber);
  res.send(trackingInfo);
});

// Endpoint for processing payments (for demonstration)
app.post('/payment', async (req, res) => {
  const { amount, user } = req.body;
  const paymentInfo = await processPayment(amount, user);
  res.send(paymentInfo);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
