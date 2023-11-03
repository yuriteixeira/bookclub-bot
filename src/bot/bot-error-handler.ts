import { Bot } from 'grammy';
import { BotContext } from './bot';

export function registerErrorHandler(bot: Bot<BotContext>) {
  bot.catch((err) => {
    const ctx = err.ctx;
    const e = err.error;
    const msg = `❌ ${e}`;

    ctx.reply(msg);
    console.error(msg);
  });
}
