# MockEase: Simplify Your Mock Server Creation 

Welcome to **MockEase**! This npm package simplifies the process of creating mock servers, enabling you to set up mock endpoints quickly and effortlessly. Built with TypeScript and leveraging the power of Express.js, MockEase is designed to help developers test their applications without the need for a live backend. 

## Features  
-  **Easy Setup**: Get a mock server up and running in minutes. 
-  **CRUD Operations**: Easily bind routes for Create, Read, Update, Delete, and Patch operations. 
-  **Authentication**: Simple middleware for handling authorization. 
-  **Route Prefixing**: Organize your routes with customizable prefixes. 
-  **Extensive Logging**: Automatically log all registered routes for easy debugging. 

## Installation 
To install MockEase, 
use npm or yarn: 
``` bash 
bash npm install mock-ease 
# or yarn 
add mock-ease
```

 ## Quick Start

Here’s a quick example to get you started:

``` typescript
const { CreateNewServer } = require("mock-ease");

CreateNewServer('MockServer')
    .BindNewGETRoute('/test', () => ({ message: 'hello' }))
    .BindNewPOSTRoute('/test', () => ({ message: 'hello' }))
    .Start();` 
```

This code sets up a new mock server with two routes: a GET route and a POST route, both responding with a JSON message `{ message: 'hello' }`.

## API Documentation

### Creating a Server

**CreateNewServer(serverName?: string)**

Creates a new instance of the `MockServer` class.

-   `serverName`: Optional. The name of the server. Defaults to 'Mock Server'.

### Instance Methods

#### EnableAuth(dummyToken: string, headerKey: string = 'authorization')

Enables a simple authorization middleware. This verifies if the value present in request headers[headerKey] equals to dummyToken provided.

-   `dummyToken`: The token to be used for authorization.
-   `headerKey`: Optional. The header key to check for the token. Defaults to 'authorization'.

#### SetRoutePrefix(prefix: string)

Sets a prefix for all routes.

-   `prefix`: The prefix to be added to all routes.

#### BindCrudRoutes(moduleName: string, schema: () => { [key: string]: any }, maxResults?: number)

Binds standard CRUD routes (GET, POST, PUT, DELETE, PATCH) for a given module.

-   `moduleName`: The name of the module.
-   `schema`: A function that returns the response schema for the module.
-   `maxResults`: Optional. The maximum number of results to return for GET requests.

#### BindNewGETRoute(route: string, responseSchema: () => { [key: string]: any }, maxResults?: number)

Binds a new GET route.

-   `route`: The route path.
-   `responseSchema`: A function that returns the response schema.
-   `maxResults`: Optional. The maximum number of results to return.

#### BindNewPOSTRoute(route: string, responseSchema: () => { [key: string]: any })

Binds a new POST route.

-   `route`: The route path.
-   `responseSchema`: A function that returns the response schema.

#### BindNewPUTRoute(route: string, responseSchema: () => { [key: string]: any })

Binds a new PUT route.

-   `route`: The route path.
-   `responseSchema`: A function that returns the response schema.

#### BindNewDELETERoute(route: string, responseSchema: () => { [key: string]: any })

Binds a new DELETE route.

-   `route`: The route path.
-   `responseSchema`: A function that returns the response schema.

#### BindNewPATCHRoute(route: string, responseSchema: () => { [key: string]: any })

Binds a new PATCH route.

-   `route`: The route path.
-   `responseSchema`: A function that returns the response schema.

#### Start(port: number = 3005)

Starts the mock server on the specified port.

-   `port`: Optional. The port number to listen on. Defaults to 3005.

## Example Usage

Here is a more comprehensive example demonstrating various features of MockEase:

``` typescript
const { CreateNewServer } = require("mock-ease");

const server = CreateNewServer('MyMockServer')
    .EnableAuth('mysecrettoken')
    .SetRoutePrefix('/api')
    .BindCrudRoutes('users', () => ({ id: 1, name: 'John Doe' }), 10)
    .BindNewGETRoute('/custom', () => ({ custom: 'data' }))
    .BindNewPOSTRoute('/submit', () => ({ success: true }));

server.Start(4000);
```
In this example:

1.  **EnableAuth**: Adds an authorization middleware that checks for the token 'mysecrettoken'.
2.  **SetRoutePrefix**: Sets a prefix '/api' for all routes.
3.  **BindCrudRoutes**: Creates CRUD routes for a 'users' module with a simple schema and a maximum of 10 results for GET requests.
4.  **BindNewGETRoute**: Adds a custom GET route.
5.  **BindNewPOSTRoute**: Adds a custom POST route.
6.  **Start**: Starts the server on port 4000.

## Logging

MockEase automatically logs all registered routes when the server starts. This helps you keep track of the available endpoints and their methods.
``` bash
MyMockServer running at http://localhost:4000
Registered Routes By MyMockServer:
GET    -  /api/users
POST   -  /api/users/create
PUT    -  /api/users/update
DELETE -  /api/users/delete
PATCH  -  /api/users/patch-update
GET    -  /api/custom
POST   -  /api/submit
```

## Conclusion

MockEase is a powerful tool that simplifies the process of creating and managing mock servers. Whether you're building a prototype or need to test your frontend without a live backend, MockEase has you covered. Happy coding!


For more information, check out our [GitHub repository](https://github.com/m-saeedk/mock-ease)