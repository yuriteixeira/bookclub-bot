import { Bot } from 'grammy';

// TODO: For testing only, remove when in production
export function helloWorldMiddleware(bot: Bot) {
  bot.on('message:text', async (ctx) => {
    console.log('>>> MSG RECEIVED: ' + ctx.message.text);

    ctx.deleteMessage();

    // TODO: Support keeping the "reply to" reference
    ctx.reply(`${ctx.from.first_name} said: ||${ctx.message.text}||`, {
      parse_mode: 'MarkdownV2',
    });
  });
}
