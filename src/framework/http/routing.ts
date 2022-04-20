import * as Koa from 'koa';
import { ILayerOptions } from 'koa-router';

type HttpVerb = "GET"|"POST"|"PUP"|"PATCH"|"DELETE"|"OPTIONS";

/**
 * Describes the structure of the details accepted
 * as REST API routes group constructor parameters
 */
interface RoutingGroupParams {
	routes: Array<RestApiRoute|RoutingGroup>;
	middleware?: Koa.Middleware[];
	prefix?: string;
}

/**
 * Describes the structure of the details accepted
 * as REST API route constructor parameters
 */
interface RouteParams {
	path: string;
	name: string;
	method: HttpVerb;
	handler: Koa.Middleware;
	middleware?: Koa.Middleware[];
	koaOpts?: ILayerOptions;
}

/**
 * Grouping REST API routes - applying common properties
 * like middleware or resource prefix etc.
 */
export class RoutingGroup {

	public routes: Array<RestApiRoute|RoutingGroup>;
	public middleware: Koa.Middleware[];
	public prefix?: string;

	public constructor(params: RoutingGroupParams) {
		this.routes = params.routes || [];
		this.middleware = params.middleware || [];
		this.prefix = params.prefix;
	}

}

/**
 * Defines a REST API route object
 */
export class RestApiRoute {

	public name: string;
	public path: string;
	public method: HttpVerb;
	public handler: Koa.Middleware;
	public middleware: Koa.Middleware[];
	public koaOpts?: ILayerOptions;

	public constructor(params: RouteParams) {
		this.name = params.name;
		this.path = params.path;
		this.method = params.method;
		this.handler = params.handler;
		this.middleware = params.middleware || [];
		this.koaOpts = params.koaOpts;
	}

}

/**
 * Indicates authorization header needs to be checked
 */
export class AuthorizedRestApiRoute extends RestApiRoute { }
