import process from 'node:process';

import { Bot } from 'grammy';

import { settingsMiddleware } from './bot-settings';
import { helloWorldMiddleware } from './bot-hello-world';
import { testDataStore } from './firestore-model';

function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Missing env var TELEGRAM_BOT_TOKEN');

  const bot = new Bot(token);

  settingsMiddleware(bot);
  helloWorldMiddleware(bot);

  console.log('>>> BookClubBot RUNNING!');
  testDataStore();

  bot.start();
}

main();
