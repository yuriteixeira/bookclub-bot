import { NextFunction } from 'grammy';
import { permissionsModel } from '../dic';
import { BotContext } from './bot';

export async function authCheck(
  ctx: BotContext,
  next: NextFunction
): Promise<void> {
  const isAuthorized = await userOrGroupIsAllowed(ctx);

  if (!isAuthorized) {
    throw new Error(
      `Access denied for this group (ID ${ctx.chat?.id}) or user (@${ctx.from?.username}). Sorry :/`
    );
  }

  await next();
}

async function userOrGroupIsAllowed(ctx: BotContext) {
  const allowedGroups = await permissionsModel.getAllowedGroups();
  if (!allowedGroups) return false;
  const isGroupAllowed = !!allowedGroups.find((id) => id === ctx.chat?.id);

  const allowedUsers = await permissionsModel.getAllowedUsers();
  if (!allowedUsers) return false;
  const isUserAllowed = !!allowedUsers.find(
    (username) => username === ctx.from?.username
  );

  return isGroupAllowed || isUserAllowed;
}
