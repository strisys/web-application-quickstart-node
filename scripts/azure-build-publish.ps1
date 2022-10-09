$subscription_file_path = ".\.subscription"
$subscription_file_exists = Test-Path -Path $subscription_file_path -PathType Leaf

if (-Not $subscription_file_exists) {
  Write-Host 'No subscription file found ' + $subscription_file_path  + ').  The file along with an Azure subscription id is required to determine which subscription to use for this operation.'
  pause
  Exit 
}

$subscription_id = Get-Content -Path $subscription_file_path

if (-Not $subscription_id) {
  Write-Host 'No subscription data found ' + $subscription_file_path  + ').  The file along with an Azure subscription id is required to determine which subscription to use for this operation.'
  pause
  Exit 
}

az login
az account set --subscription $subscription_id
az account show --output table

$version = '0.0.2'
$organization_name = 'strisys'
$resource_group_name = 'rg-web-application-quickstart'
$app_code_name = 'webapplicationquickstart'
$registry_name = 'acr' + $app_code_name
$registry_name_full = 'acr' + $app_code_name + '.azurecr.io'
$repository_name = $organization_name + '/' + $app_code_name
$image_name = $repository_name + ':v' + $version
$image_name_latest = $repository_name + ':latest'
$image_name_FULL = $registry_name_full + '/' + $image_name
$web_app_url_dev = 'https://' + $app_code_name + '-development.azurewebsites.net'
$container_name = $app_code_name
$container_filter = 'label=name=' + $container_name

# Publish to the registry and release in deployment center in Azure portal
# Tag the release as the latest
az acr build --registry $registry_name --image $image_name --file ../Dockerfile-App ../ --platform linux 
az acr import -n $registry_name --source $image_name_FULL -t $image_name_latest --force
git tag $version

# Restart the web application
# az webapp restart --name $app_code_name --resource-group $resource_group_name --slot 'development'
# start $web_app_url_dev

<# 
# OPTIONAL: Build image with Azure CLI and run locally for testing

az acr login --name $registry_name
docker build -t $image_name -f ../Dockerfile-AppDevAzure ../

# remove previous containers
Write-Host 'stopping and removing previous containers ...'
docker container stop $container_name
docker wait $container_name
docker container prune --filter $container_filter --force

# run development image and run login
start https://microsoft.com/devicelogin
Write-Host 'running container and waiting for Azure CLI login device code ...'
docker run --name $container_name -it -p 3000:3000 $image_name sh -c "az login"

Write-Host 'waiting for container to start ...'
docker wait $container_name
docker start $container_name
start http://localhost:3000
docker exec $container_name sh -c "npm start"
docker container stop $container_name
#>
