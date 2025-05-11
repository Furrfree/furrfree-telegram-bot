import {Context} from "telegraf";
import type {Message, Update} from "telegraf/types";
import {logger} from "../logger.ts";
import {NewUserRepo} from "../repositories";

function isLeftChatMembersMessage(message: Message | undefined): message is Message.LeftChatMemberMessage {
    return (message as Message.LeftChatMemberMessage).left_chat_member !== undefined;
}

export async function onMemberDelete(ctx: Context) {

    const message: (Update.New & Update.NonChannel & Message.LeftChatMemberMessage) | undefined = isLeftChatMembersMessage(ctx.message) ? ctx.message : undefined

    if (message == undefined) {
        logger.error("Message is undefined")
        return;
    }

    logger.info(`User ${message.left_chat_member.username} leave`)

    try {
        const user = await NewUserRepo.findOneBy({
            userId: message.left_chat_member.id,
        })

        await ctx.telegram.deleteMessage(message.chat.id, message.message_id);
        if (user) {
            await ctx.telegram.deleteMessage(message.chat.id, user.welcomeMessageId);
            await NewUserRepo.delete({
                userId: message.left_chat_member.id,
            })
        }

    } catch (e: any) {
        logger.error(`Error deleting join message. ${e}`)
    }
}