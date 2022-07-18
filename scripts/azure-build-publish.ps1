az login

$env:ORGANIZATION_NAME = 'strisys'
$env:APP_CODE_NAME = 'webapplicationquickstart'
$env:REGISTRY_NAME = 'acr' + $env:APP_CODE_NAME
$env:REPOSITORY_NAME = $env:ORGANIZATION_NAME + '/' + $env:APP_CODE_NAME
$env:REPOSITORY_NAME_TAG = $env:REPOSITORY_NAME + ':v0'
$env:REPOSITORY_NAME_DEV = $env:REPOSITORY_NAME + '-dev-azure'

az acr login --name $env:REGISTRY_NAME

az acr build --registry $env:REGISTRY_NAME --image $env:REPOSITORY_NAME_TAG --file ../Dockerfile-App ../
docker build -t $env:REPOSITORY_NAME_DEV -f ../Dockerfile-AppDevAzure ../