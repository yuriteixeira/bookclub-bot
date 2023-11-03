import { Bot } from 'grammy';
import { BotContext } from './bot';

const description = 'Welcome to the BookClubBot (Under Construction 🏗️)!';

const commands = [
  {
    command: 'start',
    description: 'Show all the available options',
  },
  {
    command: 'summary',
    description: 'Summary of current reading',
  },
  {
    command: 'progress',
    description: 'Update your progress on current reading (eg: /progress 10, for 10% completion)',
  },
];

export function registerSettings(bot: Bot<BotContext>) {
  bot.api.setMyDescription(description);
  bot.api.setMyCommands(commands);
}
