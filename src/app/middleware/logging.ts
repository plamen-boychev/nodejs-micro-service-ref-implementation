import * as Koa from 'koa';
import { Logger } from '../../framework/utils/logging';
import { v4 as uuidv4 } from 'uuid';

/**
 * Logging details of incoming requests and responses served
 * Also injecting a logger to be used within the route handlers
 * @param ctx Request handling context
 * @param next Next item in the pipeline (middleware, route handlers etc.)
 */
export const RequestLoggingMiddleware = async function (ctx: Koa.Context, next: () => Promise<any>) {
	const ctxID = uuidv4();
	ctx.logger = new Logger({ identifier: `Request#${ctxID}` });
	ctx.logger.debug([
		`Handling request: [${ctx.req.method}] ${ctx.req.url}`,
		"- Headers: " + JSON.stringify(ctx.req.headers, null, 2),
	].join("\n"));

	await next();

	ctx.logger.debug([
		"Serving response: ",
		"- Status: " + ctx.res.statusCode + " " + ctx.res.statusMessage,
		"- Headers: " + JSON.stringify(ctx.res.getHeaders(), null, 2),
		"- Payload: " + JSON.stringify(ctx.body, null, 2),
	].join("\n"));
};
