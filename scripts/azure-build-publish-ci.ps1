param(
    [Parameter(Mandatory = $true)]
    [String]$BuildName = '0.0.0'
) 

Write-Host "Running image build ($BuildName)"

az --version
az account show --output table

$Env:version = $BuildName
$organization_name = 'strisys'
$resource_group_name = 'rg-web-application-quickstart'
$app_code_name = 'webapplicationquickstart'
$web_app_name = $app_code_name
$registry_name = 'cr' + $app_code_name
$registry_name_full = $registry_name + '.azurecr.io'
$repository_name = $organization_name + '/' + $app_code_name
$image_name = $repository_name + ':v' + $Env:version
$image_name_latest = $repository_name + ':latest'
$image_name_full = $registry_name_full + '/' + $image_name
$web_app_url_dev = 'https://' + $web_app_name + '-development.azurewebsites.net'

$is_release = ($Env:BUILD_SOURCEBRANCHNAME -eq 'deploy')
$no_push_option = '--no-push'

if ($is_release) {
    Write-Host "This is a deployment build (source branch:=$Env:BUILD_SOURCEBRANCHNAME)"
}

if ($is_release) {$no_push_option = ''} 

Write-Host "`n[image:=$image_name, registry:=$registry_name_full, repository:=$repository_name, branch:=$Env:BUILD_SOURCEBRANCHNAME, is_release:=$is_release, no_push_option:=$no_push_option] ..."
az acr build --registry $registry_name --image $image_name --file ../Dockerfile-App ../ --platform linux --build-arg AZURE_CLIENT_ID=$env:servicePrincipalId --build-arg AZURE_CLIENT_SECRET=$env:servicePrincipalKey $no_push_option

if ($is_release) {
    az acr import -n $registry_name --source $image_name_full -t $image_name_latest --force
    
    Write-Host("tagging repo ($Env:version) ...")
    git config --global user.email "build@strisys.com"
    git config --global user.name "Azure Pipelines"    
    git tag "v$Env:version"
    git push origin --tags
    
    Write-Host("restarting webapp ($web_app_name) ...")
    az webapp restart --name $web_app_name --resource-group $resource_group_name --slot development
}
