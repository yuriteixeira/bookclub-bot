import { Bot, CommandContext, InlineKeyboard, session } from 'grammy';
import { BotContext } from './bot';
import { conversations, createConversation } from '@grammyjs/conversations';
import { ReadingModel } from '../model/types';
import { startNewReading } from './convos/start-new-reading';
import { joinCurrentReading } from './convos/join-current-reading';
import { leaveCurrentReading } from './convos/leave-current-reading';
import { updateProgressCurrentReading } from './convos/update-progress-current-reading';
import { getCurrentReading } from './convos/get-current-reading';

import 'dotenv/config';
import {permissionsModel} from '../dic';

type Option = keyof ReadingModel;
type OptionsWithDescription = Record<Option, string>;

export function registerCommandsAndConversations(bot: Bot<BotContext>) {
  registerConversations(bot);

  bot.command(['start', 'help'], async (ctx) => {
    if (!userOrGroupIsAllowed(ctx)) {
      ctx.reply(
        `❌ Access denied for this group (ID ${ctx.chat.id}). Sorry :/`
      );
      return;
    }

    ctx.reply('Welcome to BookClubBot! How can I help you today?', {
      reply_markup: getOptionsKeyboard(),
    });
  });
}

function registerConversations(bot: Bot<BotContext>) {
  bot.use(session({ initial: () => ({}) }));
  bot.use(conversations());

  bot.use(createConversation(startNewReading));
  assignBotConversationForOption(bot, 'startNewReading');

  bot.use(createConversation(joinCurrentReading));
  assignBotConversationForOption(bot, 'joinCurrentReading');

  bot.use(createConversation(leaveCurrentReading));
  assignBotConversationForOption(bot, 'leaveCurrentReading');

  bot.use(createConversation(updateProgressCurrentReading));
  assignBotConversationForOption(bot, 'updateProgressCurrentReading');

  bot.use(createConversation(getCurrentReading));
  assignBotConversationForOption(bot, 'getCurrentReading');
}

async function userOrGroupIsAllowed(ctx: CommandContext<BotContext>) {
  const allowedGroups = await permissionsModel.getAllowedGroups();
  if (!allowedGroups) return false;
  return allowedGroups.find((id) => id === ctx.chat.id);
}

function assignBotConversationForOption(bot: Bot<BotContext>, option: Option) {
  bot.callbackQuery(option, async (ctx) => {
    await ctx.conversation.enter(option);
  });
}

function getOptionsKeyboard() {
  const optionsKeyboard = new InlineKeyboard();
  const options = getOptions();

  for (const option in options) {
    const description = options[option as Option] as string;
    optionsKeyboard.text(description, option).row();
  }

  return optionsKeyboard;
}

function getOptions(): Partial<OptionsWithDescription> {
  return {
    startNewReading: 'Start a new reading',
    joinCurrentReading: 'Join the current reading',
    leaveCurrentReading: 'Leave the current reading',
    updateProgressCurrentReading: 'Update progress',
    getCurrentReading: 'Summary of current reading',
  };
}
