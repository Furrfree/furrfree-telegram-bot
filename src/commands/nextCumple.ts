import {Context, type NarrowedContext} from "telegraf";
import type {Message, Update} from "telegraf/types";
import {BirthdayRepo} from "../typeorm.config.ts";
import {Birthday} from "../entities";

export default async function next_cumple(
    ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
) {
    const query = `
        SELECT *
        FROM birthday
        WHERE groupId = ?
        ORDER BY DATE_FORMAT(date, '%m-%d') >= DATE_FORMAT(NOW(), '%m-%d') DESC,
                 DATE_FORMAT(date, '%m-%d') ASC
            LIMIT 1;
    `;

    const result:Birthday[] = await BirthdayRepo.query(query, [ctx.chat.id]);
    if (result.length == 0) {
        return await ctx.reply("No hay ningun cumpleaños añadido");
    }
    const nextBirthday = result[0];

    return await ctx.reply(
        `El próximo cumpleaños es el de @${
            nextBirthday.username
        } el dia ${nextBirthday.date.getDate()}/${nextBirthday.date.getMonth() + 1}`
    );
}