import * as Koa from 'koa';
import { Exception } from '../../framework/utils/errors';

/**
 * Checks authentication of request
 * @param ctx Request handling context
 * @param next Next item in the pipeline (middleware, route handlers etc.)
 * @todo Implement proper authentication check
 */
export const AuthenticationMiddleware = async function (ctx: Koa.Context, next: () => Promise<any>) {
	if (!ctx.req.headers.authorization) {
		throw new Exception("Unauthorized request!", 401, 1401);
	}
	await next();
};
