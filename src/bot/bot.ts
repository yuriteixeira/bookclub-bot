import process from 'node:process';

import { Bot, Context } from 'grammy';

import { settingsBotDecorator } from './bot-settings';
import { conversationsBotDecorator } from './bot-conversations';
import { Conversation, ConversationFlavor } from '@grammyjs/conversations';

import 'dotenv/config';

export type BotContext = Context & ConversationFlavor;
export type BotConversation = Conversation<BotContext>;

export function getBot() {
  const token = getTelegramToken();
  const bot = new Bot<BotContext>(token);

  settingsBotDecorator(bot);
  conversationsBotDecorator(bot);

  return bot;
}

export function getTelegramToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Missing env var TELEGRAM_BOT_TOKEN');
  return token;
}
