$env:ORGANIZATION_NAME = 'strisys'
$env:APP_CODE_NAME = 'webapplicationquickstart'
$env:REPOSITORY_NAME = $env:ORGANIZATION_NAME + '/' + $env:APP_CODE_NAME
$env:REPOSITORY_NAME_DEV = $env:REPOSITORY_NAME + '-dev-azure'
$env:CONTAINER_NAME = $env:APP_CODE_NAME
$env:CONTAINER_FILTER = 'label=name=' + $env:CONTAINER_NAME

# az login

# remove previous containers
Write-Host 'stopping and removing previous containers ...'
docker container stop $env:CONTAINER_NAME
docker wait $env:CONTAINER_NAME
docker container prune --filter $env:CONTAINER_FILTER --force

# log into using Azure CLI
start https://microsoft.com/devicelogin

# run development image and run login
Write-Host 'running container and waiting for Azure CLI login device code ...'
docker run --name $env:CONTAINER_NAME -it -p 3000:3000 $env:REPOSITORY_NAME_DEV sh -c "az login"

Write-Host 'waiting for container to start ...'
docker wait $env:CONTAINER_NAME
docker start $env:CONTAINER_NAME
start http://localhost:3000
docker exec $env:CONTAINER_NAME sh -c "npm start"
docker container stop $env:CONTAINER_NAME

pause
