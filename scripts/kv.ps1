az login

$env:RESOURCE_GROUP = ''
$env:KEY_VAULT_NAME = ''
# az keyvault create --name $env:KEY_VAULT_NAME --resource-group $env:RESOURCE_GROUP --location "EastUS"

$env:NODE_ENV = 'development'
$env:MS_SQL_SERVER = '-'
$env:MS_SQL_DATABASE = '-'
$env:MS_SQL_USER = '-'
$env:MS_SQL_PASSWORD = '-'
$env:MS_SQL_ENCRYPT = '-'
$env:MS_SQL_TRUST_SERVER_CERT = '-'
$env:AZURE_AD_TENANT = ''
$env:AZURE_AD_APP_ID = ''
$env:AZURE_AD_APP_SECRET = ''
$env:AZURE_AD_OAUTH_HOST_URL = 'http://localhost'
$env:AZURE_AD_OAUTH_HOST_PORT = 3000
$env:AZURE_AD_OAUTH_URL_FRONTEND = 'http://localhost:3000'
$env:SESSION_SECRET = '1234567890987654321'

az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name "NODE-ENV" --value $env:NODE_ENV
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'DEBUG' --value '*,-express:'
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'MS-SQL-SERVER' --value $env:MS_SQL_SERVER
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'MS-SQL-DATABASE' --value $env:MS_SQL_DATABASE
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'MS-SQL-USER' --value $env:MS_SQL_USER
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'MS-SQL-PASSWORD' --value $env:MS_SQL_PASSWORD
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'MS-SQL-ENCRYPT' --value $env:MS_SQL_ENCRYPT
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'MS-SQL-TRUST-SERVER-CERT' --value $env:MS_SQL_TRUST_SERVER_CERT
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'AZURE-AD-TENANT' --value $env:AZURE_AD_TENANT
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'AZURE-AD-APP-ID' --value $env:AZURE_AD_APP_ID
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'AZURE-AD-APP-SECRET' --value $env:AZURE_AD_APP_SECRET
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'AZURE-AD-OAUTH-HOST-URL' --value $env:AZURE_AD_OAUTH_HOST_URL
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'AZURE-AD-OAUTH-HOST-PORT' --value $env:AZURE_AD_OAUTH_HOST_PORT
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'AZURE-AD-OAUTH-URL-FRONTEND' --value $env:AZURE_AD_OAUTH_URL_FRONTEND
az keyvault secret set --vault-name $env:KEY_VAULT_NAME --name 'SESSION-SECRET' --value $env:SESSION_SECRET