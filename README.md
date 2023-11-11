# Full Stack Web Application Quickstart using DDD (Node version)

---

[![Build Status](https://dev.azure.com/strisys-devops/web-application-quickstart-node/_apis/build/status%2FBuild%20%26%20Deploy?branchName=main)](https://dev.azure.com/strisys-devops/web-application-quickstart-node/_build/latest?definitionId=10&branchName=main)

## Overview

This is a working ([see demo](https://webapplicationquickstart.azurewebsites.net/)), [DDD-inspired](https://en.wikipedia.org/wiki/Domain-driven_design) web application sample configuration, written in [TypeScript](https://www.typescriptlang.org/) using common packages (e.g [Node.js](https://nodejs.org), [Express.js](http://expressjs.com/), [Mocha](https://mochajs.org/), [React](https://reactjs.org/)), that can be used to start a new project or simply to anchor a discussion (*NOTE: The [demo](https://webapplicationquickstart.azurewebsites.net/) can take some time to come up as this is on the [free-tier of the Azure App Services](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/)*).  There is [supplemental documentation](./docs/azure) on how to deploy this to Azure using offerings such as [Azure Web App for Containers](https://learn.microsoft.com/en-gb/training/modules/deploy-run-container-app-service/), [Azure Container Registry](https://azure.microsoft.com/en-us/products/container-registry/#overview), and [Azure AD](https://learn.microsoft.com/en-ca/azure/active-directory/fundamentals/) as an identity provider for authentication . 

## Architecture

At a high-level, the major components of this architecture are simply as follows.

- [**model**](./src/model) ([**core**](./src/model/core/src), [**server**](./src/model/server/src), [**client**](./src/model/client/src)) - See below
- [**server**](./src/server/src) (web server) - Concerned with handling all concerns as they pertain to the protocols such as HTTP and WebSockets using libraries like Express.js and socket.io.  Data from the channels is translated to calls to [model.server](./src/model/server/src) for processing.
- [**ui**](./src/ui/src) (browser) - Visualization of entities expressed in [model.core](./src/model/core/src).

This architecture is [domain-driven](https://en.wikipedia.org/wiki/Domain-driven_design) by virtue of the model set of packages that can be found under the [model folder](./src/model).   A description of each of these packages is below.

- [**core**](./src/model/core/src) - Core business logic of an application containing entities, relationships, object graph navigation, serializable structures (state), business rules, calculations, reports, etc. In practice, this module is often further decomposed between entity and query (reporting) concerns.  The concepts of interest that connect the business meaning and purpose to the source code is encapsulated here.  All other modules in the application can depend on this one.
- [**server**](./src/model/server/src) - Depends on [model/core](./src/model/core/src) and is the main dependency of the [API server](./src/server) though its clients could be other things that run on a server such as a daemon.  One of the main functions of this module is its data access layer which hydrates states defined [model/core](./src/model/core/src) from various data sources (e.g. document and/or relational databases, REST APIs, file system, memory, etc).  Its general usage is in a server context and thus the name "server".  
- [**client**](./src/model/client/src) - Depends on [model/core](./src/model/core/src) and is a dependency of [UI](./src/ui). This module hydrates model core entities from data sources such as REST APIs and/or web sockets exposed by the [API server](./src/server).  The intent is for all browser networking to be done here and hidden from the rest of the application.  Its general usage is to run in a client context such as a browser thus the name "client".  The module is part of the model because from the client code perspective this is module is the gateway to model functionality.  In a nutshell, this is strongly typed API expressed in the types from [model.core](./src/model/core/src) that makes working with the REST or web sockets easier.  This is similar in theme to [SDK client libraries such as those for Azure](https://learn.microsoft.com/en-us/azure/developer/javascript/azure-sdk-library-package-index) which make working with various cloud services easier.

Some benefits, among many, of this approach are as follows:

1. **Reuse** - Code, specifically [model.core](./src/model/core/src), allowed to be used by any other module.  What is emphasized in this setup is the ability to run the same business logic code in the [user-agent](./src/ui) and on the [server (Node.js)](./src/server).  A calculation, for example, can be done on either side when both have the same [model/core code](./src/model/core/src) and data without the need for either to talk to each other.  When reuse becomes high, cost tends to trend down significantly.
2. **Testability** - The first calling client to logic isolated to the model set of projects is a test suite like [Mocha](https://mochajs.org/).  There should be no need to run the application to assert on the correctness of the modules or to have to account for a framework in the way when testing.  

## Tooling

- [Node v18.16.1](https://nodejs.org/download/release/v18.16.1) - Its recommended to use Node Version Manager ([Windows](https://github.com/coreybutler/nvm-windows/releases), [Linux](https://github.com/nvm-sh/nvm#install--update-script))
- [PowerShell Core v7.3](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.3) - The [execution policy](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.2#managing-the-execution-policy-with-powershell) should be [set](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.2) to **RemoteSigned** for the current user scope ([Windows](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.3#installing-the-msi-package), [Linux](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux?view=powershell-7.3))

## Installation

```bash
> git clone https://github.com/strisys/web-application-quickstart-node.git
> cd web-application-quickstart-node/scripts
> pwsh ./build-run-local.ps1
```

See the [docs](./docs/azure) for running on containers in combination with Azure.

## Workflow

Its necessary to mention a word about developer workflow when using [Visual Studio Code](https://code.visualstudio.com/) as switching between projects will be an frequent occurrence.  The recommended extension for this purpose is [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager).  Please refer to its documentation for configuration.

