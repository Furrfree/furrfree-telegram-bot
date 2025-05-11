// botCommands.ts
import {Context, Telegraf, type NarrowedContext} from "telegraf";
import {message} from "telegraf/filters";
import type {BotCommand, Message, Update} from "telegraf/types";
import {Birthday} from "./entities";
import {BirthdayRepo} from "./typeorm.config";
import add_cumple from "./commands/addCumple.ts";
import next_cumple from "./commands/nextCumple.ts";

export const commands: BotCommand[] = [{command: "hi", description: "hello"}];
export const groupCommands: BotCommand[] = [
    {
        command: "add_cumple",
        description: "Pon tu cumple para ser notificado",
    },
    {
        command: "next_cumple",
        description: "Ver siguiente cumpleaños"
    },
];


export async function addBotCommands(bot: Telegraf) {
    // Add commands
    bot.command("hi", (ctx) => ctx.reply("Hello"));
    bot.command("add_cumple", (ctx) => add_cumple(ctx, bot));
    bot.command("next_cumple", next_cumple);

    // Set commands list
    await bot.telegram.setMyCommands(groupCommands, {
        scope: {type: "all_group_chats"},
    });
    await bot.telegram.setMyCommands(commands);
}
