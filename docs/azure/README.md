# Web Application Quickstart on Azure

---

## Development

### Additional  Tooling

- Docker Desktop v4.9.1+

### Build & Run

On Windows, to install packages, transpile, test, and run right-click PowerShell file [`build-run-local.ps1`](../scripts/build-run-local.ps1) in the scripts folder and select `Run with PowerShell` from the context menu or run the following command from the scripts folder.  

```bash
> powershell ./docker-run-local.ps1
```

For development work in any one package see the *relative* `package.json` to determine the npm commands that are available for that package.

### Container Support

#### Build & Publish - Azure Container Registry & Docker

Though mostly decoupled using container technology, this application can target the Microsoft Azure platform for deployment and using an [Azure Container registry](https://docs.microsoft.com/en-us/azure/container-registry/) to publish images to.  To publish images, run the PowerShell script named [`azure-build-publish.ps1`](../scripts/azure-build-publish.ps1) in the scripts folder.  Its generally best to run this script in PowerShell IDE one line at a time as sometimes the login into the container registry fails and must be tried multiple times.  It should be noted that this script makes use of two Docker files - `Dockerfile-App` and `Dockerfile-AppDev`.  The former is defines the instructions to create the image meant to be used for deployment and, thus, will be published to an Azure container registry.  `Dockerfile-AppDev`, on the other hand, uses the deployment image as a base image, adds Azure CLI tools for local development use only, and is built and published locally.  See the next section to see why the Azure CLI is necessary on the development image.

#### Run with Docker

Because secrets only will be stored in Azure Key Vault, the application will need to know the identity of the current user when doing local development.  The way in which this will be done is by using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli) and logging in *on the container*.  To make this workflow easier the developer can run the PowerShell script under named [`docker-run-local-azure.ps1`](../scripts/docker-run-local-azure.ps1) in the script folder.

```bash
> powershell ./docker-run-local.ps1
```

This will allow the developer to log into Azure AD using the Azure CLI discussed in the previous section.  For this to work its assumed the developer will be given the rights directly or indirectly under the the Azure Key Vault policy to read from the key vault that is dedicated to development.

