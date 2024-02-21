import "reflect-metadata";
import { Telegraf } from "telegraf";
import { addBotCommands } from "./commands";
import { config } from "./config";
import { addCronJobs } from "./schedules";
import { AppDataSource } from "./typeorm.config";
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));
addBotCommands(bot);
addCronJobs(bot);

bot.launch();
console.log("Bot started");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
