const axios = require('axios');

// Simulate payment gateway API (you'd replace this with a real payment gateway)
async function processPayment(amount, user) {
  try {
    const response = await axios.post('https://payment-gateway.com/api/charge', {
      amount,
      user,
      api_key: process.env.PAYMENT_API_KEY,  // Your payment gateway API key
    });
    return `Payment of $${amount} successfully processed for ${user}.`;
  } catch (error) {
    console.error("Error processing payment:", error);
    return "Payment failed. Please try again later.";
  }
}

module.exports = { processPayment };
