# Web Application Quickstart (Node version)

---

### Overview

This is a web application sample configuration based on Node, Express.js and various other packages that can be cloned and modified as needed.  

This architecture is domain driven by virtue of the model set of projects that can be found in the model folder.  

- **core** - Core business logic of an application containing entities, serializable structures (state), business rules, calculations, etc. 
- **server** - Depends on core and is a dependency of server.  Hydrates core entities from data sources such as a document or relational database.
- **client** - Depends on core and is a dependency of client. Hydrates core entities from data sources such as REST APIs.

Some benefits are as follows:

1. **Reduce redundancy** - Share code between client and server or even a CLI application for that matter.  A calculation, for example, can be done on either the client or server assuming both have the same code and data without the need for either to talk to each other.
2. **Testability** - The first calling client to logic isolated to in the model set of projects is a test suite like [mocha](https://mochajs.org/).  There should be no need to run the application to assert on the correctness of the modules.  

### To Run

On Windows, run the following commands after cloning this repository.  Because this is a mono repo, the packages will have to be set up separately.

1. `cd web-application-quickstart-node\src\model\core\src`
2. `npm install`
3. `cd ..\..\server\src`
4. `npm install`
5. `cd ..\..\..\server\src`
6. `npm install`

The post install npm script related to the final step will run the application and display customer data in the browser.

