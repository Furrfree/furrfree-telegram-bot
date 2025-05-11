import {Context, type NarrowedContext, Telegraf} from "telegraf";
import type {Message, Update} from "telegraf/types";
import {message} from "telegraf/filters";
import {Birthday} from "../entities";

import type WaitingResponse from "../interfaces/WaitingResponse.ts";
import {BirthdayRepo} from "../repositories";

let waitingResponses: WaitingResponse[] = [];


export default async function add_cumple(
    context: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>,
    bot: Telegraf
) {
    const previousWaitingResponse = getWaitingResponse(
        context.chat.id.toString(),
        context.from.id.toString(),
        "add_cumple"
    );

    if (previousWaitingResponse !== undefined) {
        const chatId = context.chat.id.toString().replace("-100", "");
        const link = `https://t.me/c/${chatId}/${previousWaitingResponse.messageId}`;
        return await context.reply(
            `Ya estas añadiendo un cumpleaños, responde al [mensaje anterior](${link}) para añadir tu cumpleaños`,
            {
                parse_mode: "Markdown",
                reply_to_message_id: context.message.message_id,
            }
        );
    }

    const botMessage = await context.reply(
        "Responde a este mensaje con tu cumpleaños en formato dd/mm/aaaa",
        {
            reply_to_message_id: context.message.message_id,
        }
    );
    waitingResponses.push({
        chatId: context.chat.id.toString(),
        userId: context.from.id.toString(),
        messageId: botMessage.message_id.toString(),
        command: "add_cumple",
    });
    bot.on(message("reply_to_message"), async (ctx) => {
        const waitingResponse = getWaitingResponse(
            ctx.chat.id.toString(),
            ctx.from.id.toString(),
            "add_cumple"
        );

        if (
            waitingResponse !== undefined &&
            ctx.message.reply_to_message !== undefined
        ) {

            // @ts-ignore
            if (!ctx.message.text.includes("/")) {
                return await ctx.reply("Error: El mensaje no contiene una fecha", {
                    reply_to_message_id: ctx.message.message_id,
                });
            }

            // Create date from string with format dd/mm/yyyy
            // @ts-ignore
            const message = ctx.message.text.split("/");
            const date = new Date(
                parseInt(message[2]),
                parseInt(message[1]) - 1,
                parseInt(message[0])
            );
            if (
                date.toString() === "Invalid Date" ||
                date.getDate() != parseInt(message[0]) ||
                date.getMonth() + 1 != parseInt(message[1])
            ) {
                return await ctx.reply("Fecha no válida", {
                    reply_to_message_id: ctx.message.message_id,
                });
            }
            if (ctx.from.username === undefined) {
                await ctx.reply(
                    "No tienes un username configurado. Establece uno para poder usar esta funcion",
                    {
                        reply_to_message_id: ctx.message.message_id,
                    }
                );
                return;
            }

            const birthday = BirthdayRepo.create({
                date: date,
                groupId: ctx.chat.id,
                userId: ctx.from.id,
                username: ctx.from.username,
            })
            await BirthdayRepo.save(birthday);
            await ctx.reply("Cumpleaños guardado", {
                reply_to_message_id: ctx.message.message_id,
            });
            removeWaitingResponse(
                ctx.chat.id.toString(),
                ctx.from.id.toString(),
                "add_cumple"
            );
        }
    });
}

function removeWaitingResponse(
    chatId: string,
    userId: string,
    command: string
) {
    waitingResponses = waitingResponses.filter(
        (response) =>
            response.chatId !== chatId ||
            response.userId !== userId ||
            response.command !== command
    );
}

function getWaitingResponse(
    chatId: string,
    userId: string,
    command: string
): WaitingResponse | undefined {
    return waitingResponses.find(
        (response) =>
            response.chatId === chatId &&
            response.userId === userId &&
            response.command === command
    );
}