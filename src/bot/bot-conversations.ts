import { Bot, InlineKeyboard, session } from 'grammy';
import { BotContext } from './bot';
import { conversations, createConversation } from '@grammyjs/conversations';
import { ReadingModel } from '../model/types';
import { startNewReading } from './convos/start-new-reading';

type Option = keyof ReadingModel;
type OptionsWithDescription = Record<Option, string>;

export function conversationsBotDecorator(bot: Bot<BotContext>) {
  bot.use(session({ initial: () => ({}) }));
  bot.use(conversations());

  bot.use(createConversation(startNewReading));
  assignBotConversationForOption(bot, 'startNewReading');

  bot.command('start', async (ctx) => {
    ctx.reply('Welcome to BookClubBot! How can I help you today?', {
      reply_markup: getOptionsKeyboard(),
    });
  });
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
    optionsKeyboard.text(description, option);
  }

  return optionsKeyboard;
}

function getOptions(): Partial<OptionsWithDescription> {
  return {
    startNewReading: 'Start a new reading',
  };
}
