az --version
az account show --output table

$Env:version = '0.0.10'
$organization_name = 'strisys'
$resource_group_name = 'rg-web-application-quickstart'
$web_app_name = 'webapplicationquickstart'
$app_code_name = 'webapplicationquickstart'
$registry_name = 'acr' + $app_code_name
$registry_name_full = 'acr' + $app_code_name + '.azurecr.io'
$repository_name = $organization_name + '/' + $app_code_name
$image_name = $repository_name + ':v' + $Env:version
$image_name_latest = $repository_name + ':latest'
$image_name_FULL = $registry_name_full + '/' + $image_name
$web_app_url_dev = 'https://' + $web_app_name + '-development.azurewebsites.net'

Write-Host("`nusing 'az acr build' to build and push image ($image_name) to registry ($registry_name_full) repository ($repository_name) ...")
az acr build --registry $registry_name --image $image_name --file ../Dockerfile-App ../ --platform linux 
az acr import -n $registry_name --source $image_name_FULL -t $image_name_latest --force
# az webapp restart --name $web_app_name --resource-group $resource_group_name --slot development