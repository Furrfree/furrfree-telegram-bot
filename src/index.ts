import "reflect-metadata";
import {Context, Telegraf, TelegramError} from "telegraf";
import {message} from "telegraf/filters";
import {addBotCommands} from "./commands";
import {config} from "./config";
import {addCronJobs} from "./schedules";
import {AppDataSource} from "./typeorm.config";
import {logger} from "./logger.ts";
import type {Message, Update} from "telegraf/types";

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => logger.debug(error));
const bot = new Telegraf(config.BOT_TOKEN);

addBotCommands(bot);
addCronJobs(bot);

function isNewChatMembersMessage(message: Message | undefined): message is Message.NewChatMembersMessage {
    return (message as Message.NewChatMembersMessage).new_chat_members !== undefined;
}

function isLeftChatMembersMessage(message: Message | undefined): message is Message.LeftChatMemberMessage {
    return (message as Message.LeftChatMemberMessage).left_chat_member !== undefined;
}

async function onNewMember(ctx: Context) {

    const message: (Update.New & Update.NonChannel & Message.NewChatMembersMessage) | undefined = isNewChatMembersMessage(ctx.message) ? ctx.message : undefined
    if (message == undefined) {
        logger.error("Message is undefined")
        return;
    }

    const newMembers = message.new_chat_members

    if (!newMembers) {
        return;
    }

    for (const member of newMembers) {

        logger.info(`Joined user ${member.username}`)
        try {
            await ctx.reply(
                `¡Bienvenido, @${member.username || member.first_name}!\n\n` +
                `PARA ENTRAR:\n` +
                `\t· Leer las [normas](${config.RULES_MESSAGE}) (y estar de acuerdo con ellas)\n` +
                `\t· Ser mayor de edad: por las nuevas políticas de Telegram no podemos aceptar a personas menores de 18 años.\n` +
                `\t· Presentarse: edad (obligatorio) de donde venís, pronombres, nombres etc. Podéis usar esta [plantilla](${config.PRESENTATION_TEMPLATE_MESSAGE})\n` +
                `\t· Breve descripción y con qué podrías aportar (arte, quedadas, etc) (opcional)\n` +
                `Una vez os leamos seréis admitidos y entraréis en el grupo. Cuando entréis abandonad el grupo de admisión, por favor. Un saludo! 💜🐺`
                ,

                {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                });
        } catch (e: any) {
            logger.error(`Error sending join message: ${e}`)
        }
    }

    // Remove join message
    try {
        await ctx.telegram.deleteMessage(message.chat.id, message.message_id);
    } catch (e: any) {
        logger.error(`Error deleting join message. Check bot is admin, ${e}`)
    }
}

async function onMemberDelete(ctx: Context) {

    const message: (Update.New & Update.NonChannel & Message.LeftChatMemberMessage) | undefined = isLeftChatMembersMessage(ctx.message) ? ctx.message : undefined

    if (message == undefined) {
        logger.error("Message is undefined")
        return;
    }

    logger.info(`User ${message.left_chat_member.username} leave`)

    try {
        await ctx.telegram.deleteMessage(message.chat.id, message.message_id);

    } catch (e: any) {
        logger.error(`Error deleting join message. ${e}`)
    }
}

bot.on(message("new_chat_members"), async (ctx) => {
    console.log(typeof ctx)

    if (ctx.chat.id === config.ADMISSION_GROUP_ID) {
        await onNewMember(ctx);
    }
});

bot.on(message("left_chat_member"), async (ctx) => {
    if (ctx.chat.id === config.ADMISSION_GROUP_ID) {
        await onMemberDelete(ctx);
    }
})

// Middleware
bot.use(async (ctx: Context, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof TelegramError) {
            logger.error(`Telegram error: ${err.code} - ${err.description}`);
        } else {
            logger.error(`Unexpected error: ${err}`);
        }
    }
});


bot.launch().then(r =>
    logger.debug('Bot started')
);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
