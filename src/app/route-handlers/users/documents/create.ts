import * as Koa from 'koa';
/**
 * @todo Implement
 */
export default async (ctx: Koa.Context) => {
	ctx.status = 201;
	ctx.body = { id: "new", ...ctx.request.body };
};
