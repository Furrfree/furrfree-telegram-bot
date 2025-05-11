import {Context, Telegraf} from "telegraf";
import {BlacklistedUser} from "../entities/BlacklistedUser";
import {BlacklistedUserRepo} from "../repositories";

export default async function add_blacklisted_user(bot: Telegraf) {
    bot.command("add_blacklist", async (ctx: Context) => {
        const args = ctx.message?.text.split(" ").slice(1); // Extract arguments
        if (!args || args.length < 2) {
            return ctx.reply(
                "Usage: /add_blacklist <username> <reason>\nExample: /add_blacklist @user Spamming"
            );
        }

        const username = args[0];
        const reason = args.slice(1).join(" ");


        const blacklistedUser = new BlacklistedUser();
        blacklistedUser.telegramUsername = username;
        blacklistedUser.reason = reason;

        try {
            await BlacklistedUserRepo.save(blacklistedUser);
            await ctx.reply(`User ${username} has been blacklisted for: ${reason}`);
        } catch (error) {
            console.error("Error saving blacklisted user:", error);
            await ctx.reply("Failed to add the user to the blacklist.");
        }
    });
}