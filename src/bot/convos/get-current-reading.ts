import { BotContext, BotConversation } from '../bot';
import { readingModel } from '../../dic';
import { Timestamp } from 'firebase-admin/firestore';

export async function getCurrentReading(_: BotConversation, ctx: BotContext) {
  return getCurrentReadingCommand(ctx);
}

export async function getCurrentReadingCommand(ctx: BotContext) {
  const currentReading = await readingModel.getCurrentReading();

  if (!currentReading) {
    await ctx.reply(
      '😔 Sorry, but no reading was started yet. Maybe you should suggest one?'
    );
    return;
  }

  const readersEntries = Object.entries(currentReading.readersProgress);
  const readerEntriesSorted = readersEntries
    .sort(([_a, a], [_b, b]) => {
      return a.pctg - b.pctg;
    })
    .reverse();

  const msg =
    `*Summary of [${currentReading.book.name}](${
      currentReading.book.url || '#nolink'
    })*, ` +
    `which started on *${(currentReading.start as unknown as Timestamp)
      .toDate()
      .toDateString()}* \n\n` +
    `🏆 Reading progress \n\n` +
    readerEntriesSorted
      .map(([_, rp]) => `• ${rp.name}: ${rp.pctg}% \n`)
      .join('') +
    '\n\n';

  ctx.reply(msg, { parse_mode: 'MarkdownV2' });
}
