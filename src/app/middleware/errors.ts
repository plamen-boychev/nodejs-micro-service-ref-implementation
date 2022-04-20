import * as Koa from 'koa';
import { ConvertErrorToPayloadObject } from '../../framework/utils/errors';

/**
 * Error handler middleware for the request handling pipeline
 * @param ctx Request handling context
 * @param next Next item in the pipeline (middleware, route handlers etc.)
 */
export const ErrorHandlingMiddleware = async function (ctx: Koa.Context, next: () => Promise<any>) {
	try {
		await next();
	} catch (err) {
		err.statusCode = err.statusCode || err.status || 500;
		ctx.body = {
			errors: ConvertErrorToPayloadObject(err)
		};
		ctx.status = err.statusCode;
		// @todo Log error with all details - message, code, stack etc.
		ctx.app.emit('error', err, ctx);
	}
};
