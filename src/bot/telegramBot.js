const { queryOpenRouter } = require("../ai/queryOpenRouter")
const { fallbackAIService } = require("../ai/fallbackAIService")
const { feedbackService } = require("../utils/feedbackService")
const { Telegraf } = require('telegraf');
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

// Bot listens for messages
bot.on("text", async (ctx) => {
    const userMessage = ctx.message.text;
  
    try {
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
    } catch (error) {
      console.error("General bot error:", error);
      ctx.reply("An error occurred while processing your request. Please try again later.");
    }
    if (ctx.session?.isCollectingFeedback) {
        // Save feedback and reset the session flag
        await saveFeedback(ctx.message.from.id, ctx.message.text);
        ctx.reply("Thank you for your feedback!");
        ctx.session.isCollectingFeedback = false;
      } else {
        ctx.reply("To provide feedback, use the /feedback command.");
      }
  });
  
  bot.command('exit', (ctx) => {
    ctx.reply("Shutting down the bot...").then(() => {
        process.exit(0); // Terminates the bot
      });
  });

  bot.launch();
  
  console.log("Bot is running...");