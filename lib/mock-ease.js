"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
class MockServer {
    serverName;
    server;
    router;
    _routePrefix = '';
    _delay = 0;
    constructor(serverName) {
        this.serverName = serverName || 'Mock Server';
        this.server = (0, express_1.default)();
        this.router = express_1.default.Router();
        this.server.use(express_1.default.json());
    }
    joinPath(...path) {
        return (0, path_1.join)(...path).replace(/\\/g, '/');
    }
    SendResponseWithDelay(res, response, delay) {
        if (delay || this._delay) {
            setTimeout(() => {
                res.status(200).json(response);
            }, delay);
        }
        else {
            res.status(200).json(response);
        }
    }
    /**
    * Sets the delay for the mock server.
    *
    * @param {number} delay - The delay in milliseconds.
    * @return {MockServer} The current instance of the mock server.
    */
    SetDelay(delay) {
        this._delay = delay;
        return this;
    }
    /**
    * Enables authentication for the mock server by checking the provided token in the request headers.
    *
    * @param {string} dummyToken - The dummy token to be checked against the request headers.
    * @param {string} [headerKey='authorization'] - The key in the request headers where the token is expected. Defaults to 'authorization'.
    * @return {MockServer} The current instance of the MockServer class.
    */
    EnableAuth(dummyToken, headerKey = 'authorization') {
        const key = headerKey ?? 'authorization';
        this.router.use((req, res, next) => {
            if (req.headers[key] === `Bearer ${dummyToken}` ||
                req.headers[key] === dummyToken) {
                next();
            }
            else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        });
        return this;
    }
    /**
     * Sets the route prefix for the mock server.
     *
     * @param prefix - The route prefix to be set.
     * @returns The current instance of the `MockServer` class.
     */
    SetRoutePrefix(prefix) {
        this._routePrefix = prefix;
        return this;
    }
    /**
     * Binds CRUD routes for a given module.
     * @param moduleName - The name of the module.
     * @param schema - A function that returns the schema for the module.
     * @param maxResults - The maximum number of results to return (optional).
     * @returns The current instance of the `MockServer` class.
     */
    BindCrudRoutes(moduleName, schema, maxResults, delay) {
        this.BindNewGETRoute(`/${moduleName}`, schema, maxResults, delay);
        this.BindNewPOSTRoute(`/${moduleName}/create`, schema, delay);
        this.BindNewPUTRoute(`/${moduleName}/update`, schema, delay);
        this.BindNewDELETERoute(`/${moduleName}/delete`, schema, delay);
        this.BindNewPATCHRoute(`/${moduleName}/patch-update`, schema, delay);
        return this;
    }
    /**
     * Binds a new GET route to the server.
     *
     * @param route - The route path for the GET request.
     * @param responseSchema - A function that returns the response schema for the route.
     * @param maxResults - The maximum number of results to be returned (optional).
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns The instance of the server.
     */
    BindNewGETRoute(route, responseSchema, maxResults, delay) {
        this.router.get(route, (req, res) => {
            let response = responseSchema();
            if (maxResults) {
                response = Array.from({ length: maxResults }, () => responseSchema());
            }
            this.SendResponseWithDelay(res, response, delay);
        });
        return this;
    }
    /**
     * Binds a new POST route to the server.
     *
     * @param route - The route path for the POST request.
     * @param responseSchema - A function that returns the response for the route.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewPOSTRoute(route, responseSchema, delay) {
        this.router.post(route, (req, res) => {
            const response = responseSchema();
            this.SendResponseWithDelay(res, response, delay);
        });
        return this;
    }
    /**
     * Binds a new PUT route to the server.
     *
     * @param route - The route to bind.
     * @param responseSchema - A function that returns the response schema.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewPUTRoute(route, responseSchema, delay) {
        this.router.put(route, (req, res) => {
            const response = responseSchema();
            this.SendResponseWithDelay(res, response, delay);
        });
        return this;
    }
    /**
     * Binds a new DELETE route to the server.
     *
     * @param route - The route path for the DELETE request.
     * @param responseSchema - A function that returns the response schema for the DELETE request.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewDELETERoute(route, responseSchema, delay) {
        this.router.delete(route, (req, res) => {
            const response = responseSchema();
            this.SendResponseWithDelay(res, response, delay);
        });
        return this;
    }
    /**
     * Binds a new PATCH route to the server.
     *
     * @param route - The route path for the PATCH request.
     * @param responseSchema - A function that returns the response schema for the route.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewPATCHRoute(route, responseSchema, delay) {
        this.router.patch(route, (req, res) => {
            const response = responseSchema();
            this.SendResponseWithDelay(res, response, delay);
        });
        return this;
    }
    /**
     * Starts the mock server on the specified port.
     * @param port - The port number to listen on. Defaults to 3005 if not provided.
     */
    Start(port = 3005) {
        this.server.use(this._routePrefix, this.router);
        this.server.listen(port, () => {
            console.log(`${this.serverName} running at http://localhost:${port}`);
            this.logRoutes();
        });
    }
    logRoutes() {
        console.group(`Registered Routes By ${this.serverName}:`);
        this.server._router.stack.forEach((middleware) => {
            if (middleware.route) { // Routes registered directly on the app
                console.log(`${middleware.route.stack[0].method.toUpperCase()} - ${middleware.route.path}`);
            }
            else if (middleware.name === 'router') { // Routes registered on routers
                middleware.handle.stack.forEach((handler) => {
                    const route = handler.route;
                    if (route) {
                        const method = route.stack[0].method.toUpperCase();
                        console.log(`${method.padEnd(6, ' ')} -  ${this.joinPath(this._routePrefix, route.path)}`);
                    }
                });
            }
        });
        console.log();
        console.groupEnd();
    }
    ;
}
/**
 * Creates a new instance of the MockServer class.
 *
 * @param serverName - Optional name for the server.
 * @returns A new instance of the MockServer class.
 */
function CreateNewServer(serverName) {
    return new MockServer(serverName);
}
exports.CreateNewServer = CreateNewServer;
