import process from 'node:process';

import { Bot, Context } from 'grammy';

import { settingsBotDecorator } from './bot-settings';
import { conversationsBotDecorator } from './bot-conversations';
import { Conversation, ConversationFlavor } from '@grammyjs/conversations';
import { helloWorldBotDecorator } from './bot-hello-world';

export type BotContext = Context & ConversationFlavor;
export type BotConversation = Conversation<BotContext>;

export function main() {
  const bot = getBot();
  bot.start();
}

function getBot() {
  const token = getTelegramToken();
  const bot = new Bot<BotContext>(token);

  settingsBotDecorator(bot);
  conversationsBotDecorator(bot);

  // TODO: Remove before production
  helloWorldBotDecorator(bot);

  return bot;
}

function getTelegramToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Missing env var TELEGRAM_BOT_TOKEN');
  return token;
}
