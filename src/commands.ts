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
];

function add_cumple(
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
export function addBotCommands(bot: Telegraf) {
  bot.command("add_cumple", (ctx) => add_cumple(ctx, bot));
  bot.telegram.setMyCommands(groupCommands, {
    scope: { type: "all_group_chats" },
  });
  bot.telegram.setMyCommands(commands);
}
