# Web Application Quickstart (Node version)

---

### Overview

This is a working [DDD-inspired](https://en.wikipedia.org/wiki/Domain-driven_design) web application sample configuration based on [Node](https://nodejs.org), [Express.js](http://expressjs.com/) and various other packages that can be cloned and modified as needed.  

#### DDD

At a high-level, the major components of this architecture are simply as follows.

- [model](./src/model)
	- core
	- server
	- client 
- [server](./src/server)
- [ui](./src/ui)

This architecture is [domain-driven](https://en.wikipedia.org/wiki/Domain-driven_design) by virtue of the model set of projects that can be found in the [model folder](./src/model).  

- **core** - Core business logic of an application containing entities, relationships, object graph navigation, serializable structures (state), business rules, calculations, etc. 
- **server** - Depends on model core and is a dependency of the [Express.js](http://expressjs.com/) server.  This module hydrates model core entities from data sources such as document and/or relational databases.
- **client** - Depends on model core and is a dependency of UI. This module hydrates model core entities from data sources such as REST APIs and/or web sockets.

Some benefits are as follows:

1. **Reuse** - Share code between client and server.  A calculation, for example, can be done on either the client or server assuming both have the same model code and data without the need for either to talk to each other.
2. **Testability** - The first calling client to logic isolated to the model set of projects is a test suite like [Mocha](https://mochajs.org/).  There should be no need to run the application to assert on the correctness of the modules.  

### To Run

On Windows, run the following commands after cloning this repository.  Because this is a mono repo, the packages will have to be set up separately.

1. `cd web-application-quickstart-node\src\model\core\src`
2. `npm install`
3. `cd ..\..\server\src`
4. `npm install`
5. `cd ..\..\..\server\src`
6. `npm install`

The post install npm script related to the final step will run the application and display customer data in the browser.

