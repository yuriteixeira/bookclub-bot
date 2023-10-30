import { InlineKeyboard } from 'grammy';
import { BotContext, BotConversation } from '../bot';
import { Reading } from '../../model/types';
import { readingModel } from '../../dic';
import { confirm, yesNoKeyboard } from './shared';

export async function startNewReading(
  conversation: BotConversation,
  ctx: BotContext
) {
  await ctx.reply('📚 Start a new reading? SURE! May I ask...');

  await ctx.reply('1️⃣ Question 1/3: Book name?');
  const name = await conversation.form.text();

  await ctx.reply('2️⃣ Question 2/3: Book ISBN (you can /skip if you want)?');
  const isbn = await conversation.form.text();

  await ctx.reply('3️⃣ Question 3/3: Book URL (you can /skip if you want)?');
  const url = await conversation.form.text();

  await ctx.reply('🏁 Almost done. Review and give it a go (or not)');
  await ctx.reply(`Book name: ${name}`);
  await ctx.reply(`Book ISBN: ${isbn}`);
  await ctx.reply(`Book URL: ${url}`);
  await ctx.reply('❓All good to start the new reading?', {
    reply_markup: yesNoKeyboard,
  });

  const choice = await conversation.waitForCallbackQuery([
    confirm.YES,
    confirm.NO,
  ]);

  if (choice.match !== confirm.YES) {
    await ctx.reply('No problem. We are here for you if you need us.');
    return;
  }

  const book: Reading['book'] = {
    name,
    isbn: isbn.replace('/skip', ''),
    url: url.replace('/skip', ''),
  };

  await readingModel.startNewReading(book);

  ctx.reply('✅ New reading just got started! Enjoy!');
}
