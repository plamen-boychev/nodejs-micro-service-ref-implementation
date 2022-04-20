import * as Koa from 'koa';

/**
 * Middleware
 */
import { AuthenticationMiddleware } from '../middleware/auth';
import { RestApiRoute, RoutingGroup } from "../../framework/http/routing";
import { RequestLoggingMiddleware } from '../middleware/logging';
import { CorsEnablingMiddleware } from '../middleware/cors';

/**
 * Resource request handlers
 */
import Ping from "../route-handlers/system/ping";
import Authenticate from "../route-handlers/authentication/authenticate";

import ListUsers from "../route-handlers/users/list";
import ViewUser from "../route-handlers/users/details";
import CreateUser from "../route-handlers/users/create";
import UpdateUser from "../route-handlers/users/update";
import DeleteUser from "../route-handlers/users/delete";

import ListUserDocuments from "../route-handlers/users/documents/list";
import ViewUserDocument from "../route-handlers/users/documents/details";
import CreateUserDocument from "../route-handlers/users/documents/create";
import UpdateUserDocument from "../route-handlers/users/documents/update";
import DeleteUserDocument from "../route-handlers/users/documents/delete";

/**
 * A list of routes/groups to be provided to the routing mechanism
 * This is the structure that would enable request handling
 * @type {Array<RestApiRoute | RoutingGroup>}
 */
const routes: Array<RestApiRoute | RoutingGroup> = [];

// Globally available endpoints
const globalEndpoints = [
	new RestApiRoute({ name: "ping", path: "/ping", method: "GET", handler: Ping }),
	new RestApiRoute({ name: "authenticate", path: "/authentication", method: "POST", handler: Authenticate })
];

// Endpoints with restricted access
const restrictedEndpoints: Array<RestApiRoute | RoutingGroup> = [

	/**
	 * User documents routes
	 */
	 ...[
		new RestApiRoute({ name: "users.documents.list", path: "/users/:id/documents", method: "GET", handler: ListUserDocuments }),
		new RestApiRoute({ name: "users.documents.details", path: "/users/:id/documents/:id", method: "GET", handler: ViewUserDocument }),
		new RestApiRoute({ name: "users.documents.create", path: "/users/:id/documents", method: "POST", handler: CreateUserDocument }),
		new RestApiRoute({ name: "users.documents.update", path: "/users/:id/documents/:id", method: "PATCH", handler: UpdateUserDocument }),
		new RestApiRoute({ name: "users.documents.delete", path: "/users/:id/documents/:id", method: "DELETE", handler: DeleteUserDocument }),
	],

	/**
	 * Users routes
	 */
	...[
		new RestApiRoute({ name: "users.list", path: "/users", method: "GET", handler: ListUsers }),
		new RestApiRoute({ name: "users.details", path: "/users/:id", method: "GET", handler: ViewUser }),
		new RestApiRoute({ name: "users.create", path: "/users", method: "POST", handler: CreateUser }),
		new RestApiRoute({ name: "users.update", path: "/users/:id", method: "PATCH", handler: UpdateUser }),
		new RestApiRoute({ name: "users.delete", path: "/users/:id", method: "DELETE", handler: DeleteUser }),
	],

];

const group = new RoutingGroup({
	prefix: "/api",
	// Global endpoint middleware
	middleware: [
		RequestLoggingMiddleware,
		CorsEnablingMiddleware
	],
	routes: [
		...globalEndpoints,
		new RoutingGroup({
			routes: restrictedEndpoints,
			// Restricted endpoint middleware
			middleware: [ AuthenticationMiddleware ]
		})
	]
});

routes.push(group);

export default routes;
