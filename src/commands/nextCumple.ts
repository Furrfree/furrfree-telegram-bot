import {Context, type NarrowedContext} from "telegraf";
import type {Message, Update} from "telegraf/types";
import {BirthdayRepo} from "../typeorm.config.ts";

export default async function next_cumple(
    ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
) {
    var today = new Date();
    var birthdays = await BirthdayRepo.find({
        where: {groupId: ctx.chat.id},
    });

    if (birthdays.length == 0) {
        return await ctx.reply("No hay ningun cumpleaños añadido");
    }
    var closestBirthday = birthdays[0];
    var minDiff = Infinity;

    birthdays.forEach((birthday) => {
        // Create a new date object for the birthday this year or next year
        var nextBirthday = new Date(
            today.getFullYear(),
            birthday.date.getMonth(),
            birthday.date.getDate()
        );
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        // Calculate the difference in days
        var diff = Math.ceil(
            (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Update closestBirthday if this birthday is closer
        if (diff < minDiff) {
            closestBirthday = birthday;
            minDiff = diff;
        }
    });

    return await ctx.reply(
        `El próximo cumpleaños es el de @${
            closestBirthday.username
        } el dia ${closestBirthday.date.getDate()}/${
            closestBirthday.date.getMonth() + 1
        }`
    );
}