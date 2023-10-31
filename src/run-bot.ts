import { getBot } from './bot/bot';

console.log('>>> BookClub Bot RUNNING!', { 'process.env': process.env });

const bot = getBot();
bot.start();
