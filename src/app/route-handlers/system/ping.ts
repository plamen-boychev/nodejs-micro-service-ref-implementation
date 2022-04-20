import * as Koa from 'koa';

/**
 * Checking if the application is up
 */
export default async (ctx: Koa.Context) => {
	ctx.status = 200;
	ctx.body = { pong: true };
};
