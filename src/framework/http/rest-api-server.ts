import * as Koa from 'koa';
import { Logger } from '../utils/logging';
import * as KoaRouter from "koa-router";
import routes from '../../app/config/routes';
import { RestApiRoute, RoutingGroup } from './routing';
import { createServer, Server } from 'https';
import { readFileSync } from 'fs';

/**
 * RestApiServer init parameters
 */
interface RestApiServerParams {
	port: number;
	sslKeyFile?: string;
	sslCertFile?: string;
}

/**
 * Handles creating and managing the REST API server instance
 */
export class RestApiServer {

	/**
	 * Koa.js server instance
	 */
	private app: Koa;

	/**
	 * HTTPS server
	 */
	private server: Server;

	private logger: Logger;

	/**
	 * Middleware for handling errors
	 */
	private errorHandler: Koa.Middleware;

	/**
	 * Array of global middleware handlers to be applied
	 */
	private middleware: Koa.Middleware[];

	/**
	 *
	 * @param {RestApiServerParams} initParams Paramers to use for instantiating the server
	 */
	public constructor(private initParams: RestApiServerParams) {
		// no-op
		this.middleware = [];
		this.logger = new Logger({ identifier: "rest-api-server.ts" });
	}

	/**
	 * Setting the error handler
	 * @param {Koa.Middleware} handler
	 * @returns {RestApiServer}
	 */
	public onError(handler: Koa.Middleware) {
		this.errorHandler = handler;
		return this;
	}

	/**
	 * Add a middleware to the application main chain of execution
	 * @param {Koa.Middleware} middleware Middleware callback
	 * @returns
	 */
	public addMiddleware(middleware: Koa.Middleware) {
		this.middleware.push(middleware);
		return this;
	}

	/**
	 * Bootstrapping the server, binding to port, listening for requests
	 * @returns {RestApiServer}
	 */
	public runServer() {
		this.logger.info("Setting up the REST API server");
		this.app = new Koa();

		// Generic error handling middleware.
		this.app.use(this.errorHandler);

		// Applying global middleware callbacks
		this.middleware.forEach(mdl => this.app.use(mdl));

		// Applying routing
		const router = new KoaRouter();
		routes.forEach(route => {
			this.applyRoute(router, route);
		});
		this.app.use(router.routes());

		// Application error logging.
		this.app.on('error', console.error);

		// Start listening for requests
		this.logger.info(`Listening on port ${this.initParams.port}`);
		this.server = createServer({
			key: readFileSync(process.env.SSL_KEY),
			cert: readFileSync(process.env.SSL_CERT),
		}, this.app.callback()).listen(this.initParams.port);

		return this;
	}

	/**
	 * Enabling the route through the Koa router
	 * @param {KoaRouter} router The application router
	 * @param {RestApiRoute|RoutingGroup} route The route / group definition
	 * @param {Array<Koa.Middleware>} middleware A list of middleware to apply for the route / group
	 * @param {string|undefined} prefix Path prefix for the route / group
	 */
	private applyRoute(
		router: KoaRouter,
		route: RestApiRoute|RoutingGroup,
		middleware: Array<Koa.Middleware> = [],
		prefix?: string|undefined
	) {
		prefix = prefix || "";
		if (route instanceof RestApiRoute) {
			const fullPath = `${prefix}${route.path}`;
			this.logger.debug(`Registering route: [${route.method}] ${fullPath}`);
			router.register(
				fullPath,
				[ route.method.toLocaleLowerCase() ],
				[ ...middleware, ...route.middleware, route.handler ],
				{
					name: route.name,
					...route.koaOpts,
				}
			);
		} else {
			const fullPath = `${prefix}${route.prefix || ""}`;
			route.routes.forEach(nested => {
				this.applyRoute(router, nested, [ ...middleware, ...route.middleware ], fullPath);
			});
		}
	}

}
