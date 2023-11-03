import { BotContext, BotConversation } from '../bot';
import { readingModel } from '../../dic';

export async function updateProgressCurrentReading(
  conversation: BotConversation,
  ctx: BotContext
) {
  await ctx.reply(
    `📚 How much you have read (percentage, type only the number)?`
  );
  const pctg = await conversation.form.number();
  ctx.match = String(pctg);
  updateProgressCurrentReadingCommand(ctx);
}

export async function updateProgressCurrentReadingCommand(ctx: BotContext) {
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

  const pctg = Number(ctx.match);

  if (!pctg) {
    await ctx.reply(
      'Percentage not informed!'
    );
    return;
  }

  await readingModel.updateProgressCurrentReading(id, pctg);

  ctx.reply(`✅ Done! Good job reading ${pctg}% of the book already!`);
}
