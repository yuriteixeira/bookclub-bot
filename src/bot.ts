import { Bot } from 'grammy';
import process from 'node:process';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error('Missing env var TELEGRAM_BOT_TOKEN');

const bot = new Bot(token);

bot.api.setMyDescription('Welcome to the BookClubBot (Under Construction 🏗️)!');
bot.api.setMyCommands([
  { command: 'current', description: 'Show book that folks are reading now' },
  { command: 'join', description: 'Join club on reading the current book' },
  { command: 'leave', description: 'Give up on reading the current book' },
  {
    command: 'myprogress',
    description: 'Update my progress on the current book',
  },
  {
    command: 'progress',
    description: 'Check progress of Club on the current book',
  },
  {
    command: 'spoilers',
    description:
      'Spoiler protection: All messages will be forwarded as spoilers',
  },
  { command: 'nospoilers', description: 'Disable spoiler protection' },
]);

bot.on('message:text', async (ctx) => {
  console.log('>>> MSG RECEIVED: ' + ctx.message.text);

  ctx.deleteMessage();

  // TODO: Support keeping the "reply to" reference
  ctx.reply(`${ctx.from.first_name} said: ||${ctx.message.text}||`, {
    parse_mode: 'MarkdownV2',
  });
});

bot.start();
