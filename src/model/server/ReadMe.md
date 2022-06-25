# Model.Server

### Secret Management

This version of the application supports secret management using [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/).   This will require developers to first authenticate using the [`az login`](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli) command of the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) to support token-based authentication provided by the [`DefaultAzureCredential`](https://docs.microsoft.com/en-us/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest) class in the [`@azure/identity` package](https://docs.microsoft.com/en-us/javascript/api/@azure/identity/defaultazurecredential?view=azure-node-latest).  There is a PowerShell script in the [scripts folder](./scripts) that serves as template for automating the objects to be created as part of this process.  

