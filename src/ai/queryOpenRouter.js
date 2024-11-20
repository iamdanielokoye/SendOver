const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variable for security
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL,
    "X-Title": process.env.YOUR_APP_NAME
  }
});

async function queryOpenRouter(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "nousresearch/hermes-3-llama-3.1-405b:free", // The model you are using
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Check if response is valid and contains choices
    if (response.choices && response.choices.length > 0) {
      console.log("OpenRouter Response:", response.choices[0].message.content);
      return response.choices[0].message.content;
    } else {
      console.error("No choices found in the OpenRouter response.");
      return null; // Indicating failure in response
    }
  } catch (error) {
    console.error("Error in OpenRouter API:", error);
    return null; // Return null to indicate failure
  }
}

module.exports = { queryOpenRouter };
