param (
  [Parameter(Mandatory = $false)][string]$app_code_name = 'webapplicationquickstart'
)

az login
& "$PSScriptRoot\azure-build-publish.ps1" $app_code_name
pause