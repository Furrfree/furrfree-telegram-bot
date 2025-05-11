import {Context, TelegramError} from "telegraf";
import {logger} from "../logger.ts";

export function errorMiddleware() {
    return async (ctx: Context, next: () => Promise<void>) => {
        try {
            await next();
        } catch (err) {
            if (err instanceof TelegramError) {
                logger.error(`Telegram error: ${err.code} - ${err.description}`);
            } else {
                logger.error(`Unexpected error: ${err}`);
            }
        }
    };
}