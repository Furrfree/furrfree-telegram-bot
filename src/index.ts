import "reflect-metadata";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "./config";

const bot = new Telegraf(config.BOT_TOKEN);

const commands = [{ command: "hi", description: "hello" }];
const groupCommands = [{ command: "foo", description: "bar" }];

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.command("foo", (ctx) => ctx.reply("bar"));

// Set the bot's commands so that the user can see them in the chat
bot.telegram.setMyCommands(groupCommands, {
  scope: { type: "all_group_chats" },
});
bot.telegram.setMyCommands(commands);

bot.launch();
console.log("Bot started");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
