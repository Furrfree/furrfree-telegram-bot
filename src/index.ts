import "reflect-metadata";
import {Context, Telegraf, TelegramError} from "telegraf";
import {message} from "telegraf/filters";
import {addBotCommands} from "./commands";
import {config} from "./config";
import {AppDataSource} from "./typeorm.config";
import {logger} from "./logger.ts";
import {onMemberDelete, onNewMember} from "./updates";
import {errorMiddleware} from "./middleware";


AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        logger.debug("Data Source has been initialized!");
    })
    .catch((error) => logger.debug(error));
const bot = new Telegraf(config.BOT_TOKEN);

addBotCommands(bot).then(r => {
    logger.debug("Commands added");
});

//addCronJobs(bot);

bot.on(message("new_chat_members"), async (ctx) => {
    logger.info(`User ${ctx.message.new_chat_members[0].username} joined`);

    if (ctx.chat.id === config.ADMISSION_GROUP_ID) {
        await onNewMember(ctx);
    }
});

bot.on(message("left_chat_member"), async (ctx) => {
    logger.info(`User ${ctx.message.left_chat_member.username} left`);
    if (ctx.chat.id === config.ADMISSION_GROUP_ID) {
        await onMemberDelete(ctx);
    }
})

// Middleware
bot.use(errorMiddleware());

bot.launch();
logger.debug('Bot started')

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
