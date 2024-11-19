const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
dotenv.config();
const { handleCustomerQuery } = require('../ai/claudeAI');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Handle /start command
bot.start((ctx) => {
  ctx.reply('Welcome to SendOver! How can I assist you today? You can ask about your shipment status or anything else.');
});

// Handle customer queries about shipment status
bot.on('text', async (ctx) => {
  const userQuery = ctx.message.text;
  
  // Call Claude AI to handle the customer's query dynamically
  const response = await handleCustomerQuery(userQuery);
  
  // Send AI-generated response back to user
  ctx.reply(response);
});

// Start the bot
bot.launch().then(() => {
  console.log('Telegram bot is up and running!');
});

module.exports = bot;
