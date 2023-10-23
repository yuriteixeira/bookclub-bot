import { Bot, InlineKeyboard, session } from 'grammy';
import { BotContext, BotConversation } from './bot';
import { conversations, createConversation } from '@grammyjs/conversations';
import { Reading, ReadingModel } from './types';

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

async function startNewReading(conversation: BotConversation, ctx: BotContext) {
  enum confirm {
    YES = 'yes',
    NO = 'no',
  }

  const yesNoKeyboard = new InlineKeyboard()
    .text('Yes', confirm.YES)
    .text('No', confirm.NO);

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
    isbn,
    url,
  };

  // TODO: Store new reading using book
  ctx.reply('✅ New reading just got started! Enjoy!');
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
