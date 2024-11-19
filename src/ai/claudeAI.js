const axios = require('axios');

// Function to send query to Claude AI and get a response
async function handleCustomerQuery(query) {
  try {
    const response = await axios.post('https://api.claude.ai/ask', {
      question: query,
      api_key: process.env.CLAUDE_API_KEY,  // Your Claude API key
    });

    return response.data.answer || "Sorry, I couldn't find any information about that.";
  } catch (error) {
    console.error("Error communicating with Claude AI:", error);
    return "Sorry, something went wrong while processing your request.";
  }
}

module.exports = { handleCustomerQuery };
