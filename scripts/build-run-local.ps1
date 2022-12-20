$PSVersionTable

$subscription = "<put subscription id here>"
$outputFilePath = ".\accountlist.txt"
$line = '======================================================================================'

function Invoke-Az($params) {
    Start-Process -FilePath 'az' -ArgumentList $params -NoNewWindow -Wait -RedirectStandardOutput $outputFilePath
    $output = (Get-Content $outputFilePath)
    Remove-Item $outputFilePath
    return $output 
}

function Invoke-LoginAzure {
    $output = Invoke-Az("account list")
    $isLoggedIn = (($output | Select-String -Pattern $subscription).Matches.Count -gt 0)

    if (!$isLoggedIn) {
        az login
    }   
    
    az ad signed-in-user show
    az account set --subscription $subscription 
}

function Write-Section($params) {
    Write-Host('')
    Write-Host($line)  
    Write-Host($params) 
    Write-Host($line) 
}

function Set-Package($name, $path) {
    Write-section $name
    Set-Location $path

    $nm_folder = '.\node_modules'

    if (Test-Path $nm_folder) {
        Remove-Item -Path $nm_folder -Recurse -Force
    }

    npm install  
}

function Invoke-NpmInstall {
    Set-Package 'model.core' '..\src\model\core'
    Set-Package 'model.server' '..\server'
    Set-Package 'model.client' '..\client'
    Set-Package 'server' '..\..\server'
    Set-Package 'ui' '..\ui\browser-react'

    npm run start

    Set-Location ..\..\..\
}

# Invoke-LoginAzure
Invoke-NpmInstall

pause