import cron from "node-cron";
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

// Check birthdays every day at 00:00
cron.schedule("0 0 * * *", async () => {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  await BirthdayRepo.find({
    where: {
      date: today,
    },
  }).then((birthdays) => {
    birthdays.forEach((birthday) => {
      bot.telegram.sendMessage(
        birthday.group,
        `¡Hoy es el cumpleaños de @${birthday.username}!`,
        { parse_mode: "HTML" }
      );
    });
  });
});

bot.start((ctx) => ctx.reply("Welcome"));

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
    birthday.userId = ctx.from.id.toString();
    if (ctx.from.username === undefined) {
      ctx.reply("No tienes un username configurado");
      return;
    }

    birthday.username = ctx.from.username;
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
