import { InlineKeyboard } from 'grammy';

export enum confirm {
  YES = 'yes',
  NO = 'no',
}

export const yesNoKeyboard = new InlineKeyboard()
  .text('Yes', confirm.YES)
  .text('No', confirm.NO);
