// botCommands.ts
import { Context, Telegraf, type NarrowedContext } from "telegraf";
import type { BotCommand, Message, Update } from "telegraf/types";
import { Birthday } from "./entities";
import { BirthdayRepo } from "./typeorm.config";

export const commands: BotCommand[] = [{ command: "hi", description: "hello" }];
export const groupCommands: BotCommand[] = [
  {
    command: "add_cumple",
    description: "Pon tu cumple para ser notificado",
  },
  { command: "next_cumple", description: "Ver siguiente cumpleaños" },
];

async function add_cumple(
  ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
  bot: Telegraf
) {
  ctx.reply("Introduce tu cumpleaños en formato dd/mm/aaaa", {
    reply_markup: {
      force_reply: true,
    },
  });
  bot.on("message", async (ctx) => {
    const birthday = new Birthday();

    // Create date from string with format dd/mm/yyyy
    const message = ctx.message.text.split("/");
    var date = new Date(
      parseInt(message[2]),
      parseInt(message[1]) - 1,
      parseInt(message[0])
    );
    if (date.toString() === "Invalid Date") {
      ctx.reply("Fecha no válida");
      return;
    }
    birthday.date = date;
    birthday.group = ctx.chat.id.toString();
    birthday.userId = ctx.from.id.toString();
    if (ctx.from.username === undefined) {
      ctx.reply("No tienes un username configurado");
      return;
    }

    birthday.username = ctx.from.username;
    await BirthdayRepo.save(birthday);

    ctx.reply("Cumpleaños guardado");
  });
}

async function next_cumple(
  ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
) {
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth();
  var birthdays = await BirthdayRepo.find({
    order: {
      date: "ASC",
    },
  });

  if (birthdays.length == 0) {
    return await ctx.reply("No hay ningun cumpleaños añadido");
  }
  var nextBirthday = birthdays.find((birthday) => {
    return birthday.date.getMonth() > month && birthday.date.getDate() > day;
  });

  // If not found nextBirthday, birthday is first of the next year
  if (nextBirthday === undefined) {
    nextBirthday = birthdays[0];
  }

  return await ctx.reply(
    `El próximo cumpleaños es el de @${
      nextBirthday.username
    } el dia ${nextBirthday.date.getDate()}/${nextBirthday.date.getMonth() + 1}`
  );
}
export function addBotCommands(bot: Telegraf) {
  // Add commands
  bot.command("hi", (ctx) => ctx.reply("Hello"));
  bot.command("add_cumple", (ctx) => add_cumple(ctx, bot));
  bot.command("next_cumple", next_cumple);

  // Set commands list
  bot.telegram.setMyCommands(groupCommands, {
    scope: { type: "all_group_chats" },
  });
  bot.telegram.setMyCommands(commands);
}
