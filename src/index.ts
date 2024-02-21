import "reflect-metadata";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import type { BotCommand } from "telegraf/types";
import { config } from "./config";
import { Birthday } from "./entities";
import { AppDataSource, BirthdayRepo } from "./typeorm.config";
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
const bot = new Telegraf(config.BOT_TOKEN);

const commands: BotCommand[] = [{ command: "hi", description: "hello" }];
const groupCommands: BotCommand[] = [
  {
    command: "add_cumple",
    description: "Pon tu cumple para ser notificado",
  },
];

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.command("foo", (ctx) => ctx.reply("bar"));
bot.command("add_cumple", (ctx) => {
  ctx.reply("Introduce tu cumpleaños en formato dd/mm/aaaa", {
    reply_markup: {
      force_reply: true,
    },
  });
  bot.on(message("reply_to_message"), async (ctx) => {
    const birthday = new Birthday();

    // Create date from string with format dd/mm/yyyy
    const date = ctx.message.text.split("/");
    birthday.date = new Date(
      parseInt(date[2]),
      parseInt(date[1]) - 1,
      parseInt(date[0])
    );
    birthday.group = ctx.chat.id.toString();
    birthday.user = ctx.from.id.toString();
    console.log(birthday);
    await BirthdayRepo.save(birthday);

    ctx.reply("Cumpleaños guardado");
  });
});

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
