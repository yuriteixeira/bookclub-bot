import { Bot } from 'grammy';
import { BotContext } from './bot';

const description = 'Welcome to the BookClubBot (Under Construction 🏗️)!';

const commands = [
  {
    command: 'start',
    description: 'Show all the available options',
  },
  /*
  {
    command: 'current',
    description: 'Show book that folks are reading now',
  },
  {
    command: 'join',
    description: 'Join club on reading the current book',
  },
  {
    command: 'leave',
    description: 'Give up on reading the current book',
  },
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
  {
    command: 'nospoilers',
    description: 'Disable spoiler protection',
  },
  */
];

export function registerSettings(bot: Bot<BotContext>) {
  bot.api.setMyDescription(description);
  bot.api.setMyCommands(commands);
}
