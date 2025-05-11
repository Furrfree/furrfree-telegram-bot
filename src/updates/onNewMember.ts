import {Context} from "telegraf";
import type {Message, Update} from "telegraf/types";
import {logger} from "../logger.ts";
import {config} from "../config.ts";
import {NewUserRepo} from "../repositories";
function isNewChatMembersMessage(message: Message | undefined): message is Message.NewChatMembersMessage {
    return (message as Message.NewChatMembersMessage).new_chat_members !== undefined;
}
export async function onNewMember(ctx: Context) {
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

        let mention = `@${member.username}`;
        if (member.username == undefined) {
            mention = `[${member.first_name}](tg://user?id=${member.id})`
        }


        logger.info(`Joined user ${member.username || member.first_name}`)
        try {
            const welcomeMessage = await ctx.reply(
                `¡Bienvenido/a, ${mention}!\n\n` +
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


            await NewUserRepo.save({
                userId: member.id,
                welcomeMessageId: welcomeMessage.message_id,
            })
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
