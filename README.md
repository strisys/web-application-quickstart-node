# Web Application Quickstart (Node version)

### Overview

Web app sample configuration based on Node, Express.js and various other packages that can be cloned and modified as a faster means of starting new projects.  

One of the unique aspects of this architecture is the **model folder** of projects.  

- **core** - Core business logic of an application containing entities, serializable structures (state), business rules, calculations, etc. 
- **server** - Depends on core and is a dependency of server.  Hydrates core entities from data sources such as a document or relational database.
- **client** - Depends on core and is a dependency of client. Hydrates core entities from data sources such as REST APIs.

### To Run

Run the following commands after cloning this repository.

1. cd server
2. npm install

