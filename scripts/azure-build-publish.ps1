az login
az account set --subscription "e6ad8824-8c95-4bb0-bfd9-1cb97fd66ae8"
az account show --output table

$env:VERSION = '0.0.1'
$env:ORGANIZATION_NAME = 'strisys'
$env:RESOURCE_GROUP_NAME = 'rg-strisys-waqs'
$env:APP_CODE_NAME = 'waqs'
$env:REGISTRY_NAME = 'cr' + $env:APP_CODE_NAME
$env:REGISTRY_NAME_FULL = 'cr' + $env:APP_CODE_NAME + '.azurecr.io'
$env:REPOSITORY_NAME = $env:ORGANIZATION_NAME + '/' + $env:APP_CODE_NAME
$env:IMAGE_NAME = $env:REPOSITORY_NAME + ':v' + $env:VERSION
$env:IMAGE_NAME_LATEST = $env:REPOSITORY_NAME + ':latest'
$env:IMAGE_NAME_FULL = $env:REGISTRY_NAME_FULL + '/' + $env:IMAGE_NAME
$env:WEB_APP_URL_DEV = 'https://' + $env:APP_CODE_NAME + '-development.azurewebsites.net'
$env:CONTAINER_NAME = $env:APP_CODE_NAME
$env:CONTAINER_FILTER = 'label=name=' + $env:CONTAINER_NAME

# Publish to the registry and release in deployment center in Azure portal
# Tag the release as the latest
az acr build --registry $env:REGISTRY_NAME --image $env:IMAGE_NAME --file ../Dockerfile-App ../ --platform linux 
az acr import -n $env:REGISTRY_NAME --source $env:IMAGE_NAME_FULL -t $env:IMAGE_NAME_LATEST --force
az webapp restart --name $env:APP_CODE_NAME --resource-group $env:RESOURCE_GROUP_NAME --slot 'development'
start $env:WEB_APP_URL_DEV

<# 
# OPTIONAL: Build image with Azure CLI and run locally for testing

az acr login --name $env:REGISTRY_NAME
docker build -t $env:IMAGE_NAME -f ../Dockerfile-AppDevAzure ../

# remove previous containers
Write-Host 'stopping and removing previous containers ...'
docker container stop $env:CONTAINER_NAME
docker wait $env:CONTAINER_NAME
docker container prune --filter $env:CONTAINER_FILTER --force

# run development image and run login
start https://microsoft.com/devicelogin
Write-Host 'running container and waiting for Azure CLI login device code ...'
docker run --name $env:CONTAINER_NAME -it -p 3000:3000 $env:IMAGE_NAME sh -c "az login"

Write-Host 'waiting for container to start ...'
docker wait $env:CONTAINER_NAME
docker start $env:CONTAINER_NAME
start http://localhost:3000
docker exec $env:CONTAINER_NAME sh -c "npm start"
docker container stop $env:CONTAINER_NAME
#>
