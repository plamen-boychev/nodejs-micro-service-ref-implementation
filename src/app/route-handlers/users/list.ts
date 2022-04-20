import * as Koa from 'koa';
/**
 * @todo Implement
 */
export default async (ctx: Koa.Context) => {
	ctx.status = 200;
	ctx.body = { results: [], paging: { offset: 0, total: 0, limit: 20 } };
};
