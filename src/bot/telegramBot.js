const { queryOpenRouter } = require("../ai/queryOpenRouter")
const { fallbackAIService } = require("../ai/fallbackAIService")
const { feedbackService } = require("../utils/feedbackService")
const { showPackages, handleOrder, dummyPackages } = require('../features/orderHandler');
const { getShipmentStatus } = require('../features/shipmentTracking');
const { Telegraf, Markup } = require('telegraf');
const mongoose = require("mongoose");
const axios = require('axios');
require('dotenv').config();

// Set up the Telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const rateLimiter = new Map();

// Handle /start command
bot.start((ctx) => {
    ctx.reply('Welcome to SendOver! How can I assist you today? You can ask about your shipment status or anything else.');
  });

  
bot.command('feedback', (ctx) => {
    ctx.reply("Please share your feedback. Just type it in this chat.");
    
    // Set a session flag to indicate feedback collection
    ctx.session = ctx.session || {};
    ctx.session.isCollectingFeedback = true;
  });

  bot.command("order", async (ctx) => {
    try {
        const userId = ctx.from.id;  // Track the user ID
        const availablePackages = showPackages(userId); // Pass userId to showPackages
        ctx.reply("Available packages:", availablePackages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        ctx.reply("Failed to retrieve packages. Please try again later.");
    }
});

bot.action(/order_(\d+)/, async (ctx) => {
  const packageId = ctx.match[1]; // Extract package ID from the callback data
  const selectedPackage = dummyPackages.find(pkg => pkg.id === parseInt(packageId, 10));
  
  if (!selectedPackage) {
      return ctx.reply("Invalid package selected.");
  }
  
  // Await the result of the order processing
  const orderConfirmation = await handleOrder(ctx.from.id, selectedPackage.id, selectedPackage.name);
  
  // Send the order confirmation message
  ctx.reply(orderConfirmation); // Send order confirmation
});

bot.action(/disabled_(\d+)/, (ctx) => {
    // If the user tries to select a package that has already been chosen
    ctx.reply("You have already placed an order. Please use the 'order' command again if you wish to choose another package.");
});


// Bot listens for messages
bot.command('trackshipment', async (ctx) => {
  try {
    // Ask the user for their Order ID
    ctx.reply('Please enter your Order ID to track the shipment (e.g., ORD-12345):');
  } catch (error) {
    console.error('Error handling trackshipment command:', error);
    ctx.reply("An error occurred while processing your request. Please try again later.");
  }
});

bot.command("payment", async (ctx) => {
  try {
    // Create inline keyboard with two payment options
    const paymentKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.url("Buy Me a Coffee", "https://www.buymeacoffee.com/your_username"), // Replace with your Buy Me a Coffee link
        Markup.button.url("Patreon", "https://www.patreon.com/your_username") // Replace with your Patreon link
      ]
    ]);

    // Send message with payment options
    await ctx.reply("Please choose your payment method:", paymentKeyboard);
  } catch (error) {
    console.error("Error processing payment command:", error);
    ctx.reply("An error occurred while processing the payment options. Please try again later.");
  }
});

// Handle text input from the user for Order ID
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text.trim();

  try {
    // If the message starts with an order ID (e.g., ORD-12345), process the shipment status
    if (userMessage.startsWith('ORD-')) {
      const statusMessage = await getShipmentStatus(userMessage); // Call the function to check shipment status
      ctx.reply(statusMessage); // Send the status back to the user
    } else {
      // Handle other messages or general queries (like OpenRouter, fallback AI, etc.)
      let openRouterResponse = null;

      try {
        openRouterResponse = await queryOpenRouter(userMessage);
        if (!openRouterResponse) {
          console.log("OpenRouter response was invalid, switching to fallback.");
          throw new Error("OpenRouter failed.");
        }

        console.log("OpenRouter Response:", openRouterResponse);
        ctx.reply(openRouterResponse); // Send OpenRouter response
      } catch (error) {
        console.error("OpenRouter failed:", error.message);
        ctx.reply("Sorry, OpenRouter didn't respond properly. Switching to backup AI.");

        const fallbackAIResponse = await queryFallbackAI(userMessage);
        console.log("Fallback AI Response:", fallbackAIResponse);
        ctx.reply(fallbackAIResponse); // Send fallback AI response
      }
    }
  } catch (error) {
    console.error("General bot error:", error);
    ctx.reply("An error occurred while processing your request. Please try again later.");
  }

  // Feedback collection logic
  if (ctx.session?.isCollectingFeedback) {
    // Save feedback and reset the session flag
    await saveFeedback(ctx.message.from.id, ctx.message.text);
    ctx.reply("Thank you for your feedback!");
    ctx.session.isCollectingFeedback = false;
  }
});
  
  bot.command('exit', (ctx) => {
    ctx.reply("Shutting down the bot...").then(() => {
        process.exit(0); // Terminates the bot
      });
  });

  bot.launch();
  
  console.log("Bot is running...");