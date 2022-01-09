# Web Application Quickstart (Node version)

---

### Overview

Web app sample configuration based on Node, Express.js and various other packages that can be cloned and modified as a faster means of starting new projects.  

One of the unique aspects of this architecture is the **model folder** of projects.  

- **core** - Core business logic of an application containing entities, serializable structures (state), business rules, calculations, etc. 
- **server** - Depends on core and is a dependency of server.  Hydrates core entities from data sources such as a document or relational database.
- **client** - Depends on core and is a dependency of client. Hydrates core entities from data sources such as REST APIs.

### To Run

Run the following commands after cloning this repository.  Because this is a mono repo, the packages will have to be set up separately.

1. `cd web-application-quickstart-node\src\model\core\src`
2. `npm install`
3. `cd ..\..\server\src`
4. `npm install`
5. `cd ..\..\..\server\src`
6. `npm install`

The post install npm script related to the final step will run the application.

