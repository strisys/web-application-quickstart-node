# Full Stack Web Application Quickstart using DDD (Node version)

---

### Overview

This is a working, [DDD-inspired](https://en.wikipedia.org/wiki/Domain-driven_design) web application sample configuration, written in [TypeScript](https://www.typescriptlang.org/) using common packages (e.g [Express.js](http://expressjs.com/), [Mocha](https://mochajs.org/)), that can be used to start a new project or simply to anchor a discussion.  

#### DDD

At a high-level, the major components of this architecture are simply as follows.

- [**model**](./src/model)
	- [**core**](./src/model/core/src)
	- [**server**](./src/model/server/src)
	- [**client**](./src/model/client/src)
- [**server**](./src/server/src)
- [**ui**](./src/ui/src)

This architecture is [domain-driven](https://en.wikipedia.org/wiki/Domain-driven_design) by virtue of the model set of projects that can be found in the [model module](./src/model).  

- [**core**](./src/model/core/src) - Core business logic of an application containing entities, relationships, object graph navigation, serializable structures (state), business rules, calculations, reports, etc. In practice, this module is often further decomposed between entity and query (reporting) concerns.  The concepts of interest that connect the business meaning and purpose to the source code is encapsulated here.  All other modules in the application can depend on this one.
- [**server**](./src/model/server/src) - Depends on model/core and is the main dependency of the [API server](./src/server) though its clients could be other things that run on a server.  One of the main functions of this module is its data access layer which hydrates states defined model/core from various data sources (e.g. document and/or relational databases, REST APIs, etc).  Its general usage is a server context and thus the name "server".  
- [**client**](./src/model/client/src) - Depends on model/core and is a dependency of [UI](./src/ui). This module hydrates model core entities from data sources such as REST APIs and/or web sockets exposed by the [API server](./src/server).  Its general usage is to run in a client context such as a browser thus the name "client".

Some benefits, among many, of this approach are as follows:

1. **Reuse** - Code is shared between [ui](./src/ui) and [server](./src/server) via the model core.  A calculation, for example, can be done on either the client or server assuming both have the same [model/core code](./src/model/core/src) and data without the need for either to talk to each other.
2. **Testability** - The first calling client to logic isolated to the model set of projects is a test suite like [Mocha](https://mochajs.org/).  There should be no need to run the application to assert on the correctness of the modules or to have to account for a framework in the way when testing.  

Notice simply that [**server**](./src/server/src) and [**model/server**](./src/model/server/src) have been removed.  

### Tooling

- [Node v16.13.1](https://nodejs.org/download/release/v16.13.2)
- PowerShell v5.1 - The [execution policy](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.2#managing-the-execution-policy-with-powershell) should be [set](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.2) to **RemoteSigned** for the current user scope

### To Install & Run

On Windows:

```bash
> git clone https://github.com/strisys/web-application-quickstart-node.git
> cd web-application-quickstart-node/scripts
> powershell ./build-run-local.ps1
```

See the [docs](./docs/azure) for running on containers in combination with Azure.