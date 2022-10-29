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

function Invoke-NpmInstall {
    # model core
    Write-Section('model.core')
    Set-Location ..\src\model\core
    npm install

    # model server
    Write-Section('model.server')
    Set-Location ..\server
    npm install

    # model client
    Write-Section('model.client')
    Set-Location ..\client
    npm install

    # server
    Write-Section('server')
    Set-Location ..\..\server
    npm install

    # ui browser-react
    Write-Section('browser-react')
    Set-Location ..\ui\browser-react
    npm install
    npm run start

    Set-Location ..\..\..\
}

Invoke-LoginAzure
Invoke-NpmInstall

pause