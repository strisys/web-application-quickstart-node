git config --global user.email "strisys-devops@dev.azure.com"
git config --global user.name "Azure Pipelines"

& "$PSScriptRoot\azure-build-publish.ps1"

Write-Host("tagging repo ($Env:version) ...")
git tag "v$Env:version"
git push origin --tags