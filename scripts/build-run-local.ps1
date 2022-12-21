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

    $nm_path = '.\node_modules'

    if (Test-Path $nm_path) {
        Write-Host "removing previously installed packages ..."
        Remove-Item -Path .\node_modules -Recurse -Force  
    }

    Write-Host "installing packages ..."
    $result = (Start-Process -FilePath "npm" -Args "install" -PassThru -Wait -NoNewWindow).ExitCode    

    if ($result -ne 0) {
        $err = "The 'npm install' command to build '$name' failed (error code: $result).  See logs for details"
        Write-Error $err
        pause 
        throw $err
    }
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