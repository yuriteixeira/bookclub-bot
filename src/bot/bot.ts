import process from 'node:process';

import { Bot, Context } from 'grammy';

import { registerSettings } from './bot-settings';
import { registerCommandsAndConversations } from './bot-conversations';
import { Conversation, ConversationFlavor } from '@grammyjs/conversations';

import 'dotenv/config';

export type BotContext = Context & ConversationFlavor;
export type BotConversation = Conversation<BotContext>;

export function getBot() {
  const token = getTelegramToken();
  const bot = new Bot<BotContext>(token);

  registerSettings(bot);
  registerCommandsAndConversations(bot);

  return bot;
}

export function getTelegramToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Missing env var TELEGRAM_BOT_TOKEN');
  return token;
}
