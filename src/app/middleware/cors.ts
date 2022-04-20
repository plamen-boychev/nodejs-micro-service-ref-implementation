import * as Koa from 'koa';

/**
 * Enabling Cross-Origin-Resource-Sharing
 * @param ctx Request handling context
 * @param next Next item in the pipeline (middleware, route handlers etc.)
 * @todo Add any missing required headers
 */
export const CorsEnablingMiddleware = async function (ctx: Koa.Context, next: () => Promise<any>) {
	ctx.req.headers["access-control-allow-origin"] = "*";
	ctx.req.headers["access-control-allow-headers"] = "*";
	await next();
};
