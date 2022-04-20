import { config as loadDotEnv } from "dotenv";
import { ErrorHandlingMiddleware } from "../app/middleware/errors";
import { RestApiServer } from "../framework/http/rest-api-server";
import * as bodyParser from "koa-bodyparser";

// Loading the .env file contents to the process global object
loadDotEnv();

// Start the server
const server = new RestApiServer({
	port: parseInt(process.env.WEB_SERVER_PORT),
	sslKeyFile: process.env.SSL_KEY,
	sslCertFile: process.env.SSL_CERT,
});
server.onError(ErrorHandlingMiddleware);
server.addMiddleware(bodyParser());
server.runServer();
