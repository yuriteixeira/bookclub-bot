import { BotContext, BotConversation } from '../bot';
import { readingModel } from '../../dic';
import { confirm, yesNoKeyboard } from './shared';

export async function leaveCurrentReading(
  conversation: BotConversation,
  ctx: BotContext
) {
  const id = ctx.from?.id;

  if (!id) {
    await ctx.reply(
      'Problems fetching your Telegram ID. Please try again later.'
    );
    return;
  }

  const currentReading = await readingModel.getCurrentReading();

  if (!currentReading) {
    await ctx.reply(
      '😔 Sorry, but no reading was started yet. Maybe you should suggest one?'
    );
    return;
  }

  if (!currentReading.readersProgress[id]) {
    await ctx.reply(
      `🚦 You haven't joined the reading ${currentReading.book.name} yet!`
    );
    return;
  }

  await ctx.reply(
    `📚 The group is currently reading ${currentReading.book.name}`
  );

  await ctx.reply('Would you like to leave?', {
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

  await readingModel.leaveCurrentReading(id);

  ctx.reply('✅ Done! Come back anytime!');
}
