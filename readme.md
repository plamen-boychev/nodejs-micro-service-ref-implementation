# Node.js micro service reference implementation - EARLY BETA
Illustrates an approach of building a basic Node.js REST API services.  
Uses Koa.js as a base as the implementation aims to provide:
- Routing improvements - routes can be grouped, so common features can be defined:
  - Middleware groups
  - Resource path prefixes
- Basic logging (console only for the time being)
- Structural guidance
- Bootstrapping the web server

## Configuration

### DotEnv
There is a `.env` file support. It would contain values emulating environment variables. If there are actual environment variables it would not be requried, but those could be mocked via the file. For container deployments those could be injected directly in the container.  
The `.env.example` file should be used as a template for the supported variables. For new deployments should be copied to `.env` and proper values should be provided.  

### SSL
HTTPS is supported, as files can be introduced under the `ssl` path in the root directory of the project.  
These should be specified as environment variables (or in the `.env` file).  
It is a best practice to have separated the environment-specific (development/test/pre-production/production etc.) files, so those could be used in each deployment as needed.  

### Routing
Routing configuraiton is available through `src/app/config/routes.ts`. The routes are baked withing the application, so upon changes it needs to be restarted.  
The general idea is to produce a single list or definitions that the routing mechanism is going to use to find a match for incoming requests.  
The list contains two types of objects:
- Route - defines:
  - name - identifier of the route
  - path - path of the resource endpoint
  - method - HTTP verb
  - handler - callback for handling the request and producing a response
  - middleware - a list of middlewares to decorate the handling chain
  - koaOpts - some low-level options the Koa.js framework supports, if needed
- Route Group - defines:
  - routes - a list of routes or nested routing groups
  - prefix - a resource path prefix, will be applied to all routes / nested groups
  - middleware - a list of middleware - will be applied to all routes / nested groups

**Route order is important** - first match would be used, example:
 - `/api/users/:id` would return details of a user
 - `/api/users/documents` would return list of all user documents available (not implemented, just used for example)
In this case we need to define `/api/users/documents` before `/api/users/:id` - this way if no direct match is found for the documents endpoint the router would be looking further and find the one for fetching user details.

## Route handlers
The architecture does not rely on controllers. Each route would have its own handler callback, ensuring single responsibility. Those are meant to be put in the `src/app/route-handlers` path. Common functionality should be located into properly defined structures, grouped by their purpose, e.g. utilities, ORM/Active record implementations, third-party system classes etc.  
The handlers would compose a workflow of execution using library classes. This way it is possible to have proper unit testing for the library classes and smoke/integration/functional testing for the end-to-end functionality of a route handler.

## Development
There is a `run-dev` npm command that would trigger a build using nodemod, which would use the TypeScript codebase directly.  
Introducing a change to the code would trigger application restart.  

## Deployment
The TypeScript codebase needs to be transpiled to vanilla JavaScript. This is possible via the `build` npm command.  
The generated code would be placed withing a `dist` directory.  
In order to run the application you need to run `node project-root/dist/cli/run-server.js`.  
It is suggested to use pm2 for deployment, as that would provide:
- Redundancy of application instances being deployed
- Load balancing of the deployed applications
- Lifecycle management, including spinning up process if it has stopped
- Automatic services startup when the host is booted
- Log rotation

## Logs
Currently the logs are written to the console, example:
```bash
[2022-04-20T13:10:32.181Z][INFO][rest-api-server.ts] Listening on port 443
[2022-04-20T13:11:01.647Z][DEBUG][Request#61c7c11c-cfd6-4899-bb5a-ab9221132692] Handling request: [GET] /api/ping
- Headers: {
  "user-agent": "PostmanRuntime/7.29.0",
  "accept": "*/*",
  "postman-token": "d9c88969-41cf-4f93-be27-e53036189a56",
  "host": "localhost:443",
  "accept-encoding": "gzip, deflate, br",
  "connection": "keep-alive"
}
[2022-04-20T13:11:01.647Z][DEBUG][Request#61c7c11c-cfd6-4899-bb5a-ab9221132692] Serving response: 
- Status: 200 OK
- Headers: {
  "content-type": "application/json; charset=utf-8"
}
- Payload: {
  "pong": true
}
```
If the application is deployed via pm2 (as suggested) those could be stored and rotated based on package configuration.
