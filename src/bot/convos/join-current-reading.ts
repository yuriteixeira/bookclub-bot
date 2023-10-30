import { BotContext, BotConversation } from '../bot';
import { readingModel } from '../../dic';
import { confirm, yesNoKeyboard } from './shared';

export async function joinCurrentReading(
  conversation: BotConversation,
  ctx: BotContext
) {
  const id = ctx.from?.id;
  const name = `${ctx.from?.first_name} (@${ctx.from?.username})`;

  if (!id || !name) {
    await ctx.reply(
      'Problems fetching your name and Telegram ID. Please try again later.'
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

  if (currentReading.readersProgress[id]) {
    await ctx.reply(
      `✅ You already joined the reading ${currentReading.book.name}!`
    );
    return;
  }

  await ctx.reply(
    `📚 The group is currently reading ${currentReading.book.name}`
  );

  await ctx.reply('Would you like to join?', {
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

  await readingModel.joinCurrentReading(id, name);

  ctx.reply('✅ Welcome to the current reading! Enjoy!');
}
