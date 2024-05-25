import express from 'express';
import { join } from 'path';

class MockServer {
    private serverName: string;
    private server: express.Express;
    private router: express.Router;

    private _routePrefix: string = '';

    constructor(serverName?: string) {
        this.serverName = serverName || 'Mock Server';
        this.server = express();
        this.router = express.Router();
    }

    private joinPath(...path: string[]) {
        return join(...path).replace(/\\/g, '/');
    }

    EnableAuth(dummyToken: string, headerKey: string = 'authorization') {
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
    SetRoutePrefix(prefix: string) {
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
    BindCrudRoutes(moduleName: string, schema: () => { [key: string]: any }, maxResults?: number) {
        this.BindNewGETRoute(`/${moduleName}`, schema, maxResults);
        this.BindNewPOSTRoute(`/${moduleName}/create`, schema);
        this.BindNewPUTRoute(`/${moduleName}/update`, schema);
        this.BindNewDELETERoute(`/${moduleName}/delete`, schema);
        this.BindNewPATCHRoute(`/${moduleName}/patch-update`, schema);

        return this;
    }

    /**
     * Binds a new GET route to the server.
     * 
     * @param route - The route path for the GET request.
     * @param responseSchema - A function that returns the response schema for the route.
     * @param maxResults - The maximum number of results to be returned (optional).
     * @returns The instance of the server.
     */
    BindNewGETRoute(route: string, responseSchema: () => { [key: string]: any }, maxResults?: number) {
        let response = responseSchema();
        if (maxResults) { response = Array.from({ length: maxResults }, () => responseSchema()); }

        this.router.get(route, (req, res) => {
            res.status(200).json(response);
        });

        return this;
    }

    /**
     * Binds a new POST route to the server.
     * 
     * @param route - The route path for the POST request.
     * @param responseSchema - A function that returns the response for the route.
     * @returns - The current instance of the MockServer.
     */
    BindNewPOSTRoute(route: string, responseSchema: () => { [key: string]: any }): MockServer {
        let response = responseSchema();
        this.router.post(route, (req, res) => {
            res.status(200).json(response);
        });

        return this;
    }

    /**
     * Binds a new PUT route to the server.
     * 
     * @param route - The route to bind.
     * @param responseSchema - A function that returns the response schema.
     * @returns - The current instance of the MockServer.
     */
    BindNewPUTRoute(route: string, responseSchema: () => { [key: string]: any }) {
        let response = responseSchema();
        this.router.put(route, (req, res) => {
            res.status(200).json(response);
        });

        return this;
    }

    /**
     * Binds a new DELETE route to the server.
     * 
     * @param route - The route path for the DELETE request.
     * @param responseSchema - A function that returns the response schema for the DELETE request.
     * @returns - The current instance of the MockServer.
     */
    BindNewDELETERoute(route: string, responseSchema: () => { [key: string]: any }) {
        let response = responseSchema();
        this.router.delete(route, (req, res) => {
            res.status(200).json(response);
        });

        return this;
    }

    /**
     * Binds a new PATCH route to the server.
     * 
     * @param route - The route path for the PATCH request.
     * @param responseSchema - A function that returns the response schema for the route.
     * @returns - The current instance of the MockServer.
     */
    BindNewPATCHRoute(route: string, responseSchema: () => { [key: string]: any }) {
        let response = responseSchema();
        this.router.patch(route, (req, res) => {
            res.status(200).json(response);
        });

        return this;
    }

    /**
     * Starts the mock server on the specified port.
     * @param port - The port number to listen on. Defaults to 3005 if not provided.
     */
    Start(port: number = 3005) {
        this.server.use(this._routePrefix, this.router);
        this.server.listen(port, () => {
            console.log(`${this.serverName} running at http://localhost:${port}`);
            this.logRoutes();
        });
    }

    logRoutes() {
        console.group(`Registered Routes By ${this.serverName}:`);
        this.server._router.stack.forEach((middleware: { route: { stack: { method: string; }[]; path: any; }; name: string; handle: { stack: any[]; }; }) => {
            if (middleware.route) { // Routes registered directly on the app
                console.log(`${middleware.route.stack[0].method.toUpperCase()} - ${middleware.route.path}`);
            } else if (middleware.name === 'router') { // Routes registered on routers
                middleware.handle.stack.forEach((handler) => {
                    const route = handler.route;
                    if (route) {
                        const method: string = route.stack[0].method.toUpperCase();
                        console.log(`${method.padEnd(6, ' ')} -  ${this.joinPath(this._routePrefix, route.path)}`);
                    }
                });
            }
        });
        console.log();
        console.groupEnd();
    };
}

/**
 * Creates a new instance of the MockServer class.
 * 
 * @param serverName - Optional name for the server.
 * @returns A new instance of the MockServer class.
 */
export function CreateNewServer(serverName?: string) {
    return new MockServer(serverName);
}