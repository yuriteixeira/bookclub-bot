import { Bot } from 'grammy';
import { BotContext } from './bot';

// TODO: For testing only, remove when in production
export function helloWorldBotDecorator(bot: Bot<BotContext>) {
  bot.on('message', async (ctx) => {
    console.log('MSG RECEIVED: ' + ctx.message.text);

    ctx.deleteMessage();

    // TODO: Support keeping the "reply to" reference
    ctx.reply(`${ctx.from.first_name} said: ||${ctx.message.text}||`, {
      parse_mode: 'MarkdownV2',
    });
  });
}
