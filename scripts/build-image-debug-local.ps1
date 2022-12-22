<#
Use the following 2 docker build commands to first build the application image and then use that image as the base of another
that has the Azure CLI installed.
#>
docker build -f ..\Dockerfile-App ..\ --tag strisys/webapplicationquickstart
docker build -f ..\Dockerfile-AppDebug ..\ --tag strisys/webapplicationquickstart-debug 

# Remove previous container if exits
Clear-Host
Write-Host
Write-Host 'pruning previous Docker containers ...'
docker container stop webapplicationquickstart-debug
docker container prune --force --filter "label=name=web-application-quickstart-debug"

Write-Host 'creating an running application container for debugging locally ...'
Clear-Host
Write-Host
Write-Host "   INSTRUCTIONS:"
Write-Host "1. Log into Azure AD using 'az login' to establish idenity so resources (e.g. Key Vault) can be accessed securely."
Write-Host "2. Start the web server using 'npm start'"
Write-Host "3. Open a new browser window to http://localhost:3000"
Write-Host
Start-Process 'https://microsoft.com/devicelogin'
docker run --name webapplicationquickstart-debug -p 3000:3000 -i --tty strisys/webapplicationquickstart-debug 