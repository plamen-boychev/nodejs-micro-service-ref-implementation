import * as Koa from 'koa';
/**
 * @todo Implement
 */
export default async (ctx: Koa.Context) => {
	ctx.status = 200;
	ctx.body = { id: ctx.params.id, ...ctx.request.body };
};
