// cronJobs.ts
import cron from "node-cron";
import { Telegraf } from "telegraf";
import { BirthdayRepo } from "./typeorm.config";

async function checkBirthdays(bot: Telegraf) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  await BirthdayRepo.find({
    where: {
      date: today,
    },
  }).then((birthdays) => {
    birthdays.forEach((birthday) => {
      bot.telegram.sendMessage(
        birthday.groupId,
        `¡Hoy es el cumpleaños de @${birthday.username}!`,
        { parse_mode: "HTML" }
      );
    });
  });
}

export function addCronJobs(bot: Telegraf) {
  // Check birthdays every day at 00:00
  cron.schedule("1 0 * * *", async () => {
    checkBirthdays(bot);
  });
}
