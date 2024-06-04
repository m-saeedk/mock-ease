declare class MockServer {
    private serverName;
    private server;
    private router;
    private _routePrefix;
    private _delay;
    constructor(serverName?: string);
    private joinPath;
    private SendResponseWithDelay;
    /**
    * Sets the delay for the mock server.
    *
    * @param {number} delay - The delay in milliseconds.
    * @return {MockServer} The current instance of the mock server.
    */
    SetDelay(delay: number): MockServer;
    /**
    * Enables authentication for the mock server by checking the provided token in the request headers.
    *
    * @param {string} dummyToken - The dummy token to be checked against the request headers.
    * @param {string} [headerKey='authorization'] - The key in the request headers where the token is expected. Defaults to 'authorization'.
    * @return {MockServer} The current instance of the MockServer class.
    */
    EnableAuth(dummyToken: string, headerKey?: string): MockServer;
    /**
     * Sets the route prefix for the mock server.
     *
     * @param prefix - The route prefix to be set.
     * @returns The current instance of the `MockServer` class.
     */
    SetRoutePrefix(prefix: string): this;
    /**
     * Binds CRUD routes for a given module.
     * @param moduleName - The name of the module.
     * @param schema - A function that returns the schema for the module.
     * @param maxResults - The maximum number of results to return (optional).
     * @returns The current instance of the `MockServer` class.
     */
    BindCrudRoutes(moduleName: string, schema: () => {
        [key: string]: any;
    }, maxResults?: number, delay?: number): this;
    /**
     * Binds a new GET route to the server.
     *
     * @param route - The route path for the GET request.
     * @param responseSchema - A function that returns the response schema for the route.
     * @param maxResults - The maximum number of results to be returned (optional).
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns The instance of the server.
     */
    BindNewGETRoute(route: string, responseSchema: () => {
        [key: string]: any;
    }, maxResults?: number, delay?: number): this;
    /**
     * Binds a new POST route to the server.
     *
     * @param route - The route path for the POST request.
     * @param responseSchema - A function that returns the response for the route.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewPOSTRoute(route: string, responseSchema: () => {
        [key: string]: any;
    }, delay?: number): MockServer;
    /**
     * Binds a new PUT route to the server.
     *
     * @param route - The route to bind.
     * @param responseSchema - A function that returns the response schema.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewPUTRoute(route: string, responseSchema: () => {
        [key: string]: any;
    }, delay?: number): this;
    /**
     * Binds a new DELETE route to the server.
     *
     * @param route - The route path for the DELETE request.
     * @param responseSchema - A function that returns the response schema for the DELETE request.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewDELETERoute(route: string, responseSchema: () => {
        [key: string]: any;
    }, delay?: number): this;
    /**
     * Binds a new PATCH route to the server.
     *
     * @param route - The route path for the PATCH request.
     * @param responseSchema - A function that returns the response schema for the route.
     * @param delay - The delay in milliseconds (optional). This overrides the global level delay, if set.
     * @returns - The current instance of the MockServer.
     */
    BindNewPATCHRoute(route: string, responseSchema: () => {
        [key: string]: any;
    }, delay?: number): this;
    /**
     * Starts the mock server on the specified port.
     * @param port - The port number to listen on. Defaults to 3005 if not provided.
     */
    Start(port?: number): void;
    logRoutes(): void;
}
/**
 * Creates a new instance of the MockServer class.
 *
 * @param serverName - Optional name for the server.
 * @returns A new instance of the MockServer class.
 */
export declare function CreateNewServer(serverName?: string): MockServer;
export {};
