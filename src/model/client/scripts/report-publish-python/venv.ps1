python --version

Write-Host "Creating a virtual environment  ..."
py -3 -m venv .venv

Write-Host "Activating virtual environment  ..."
Start-Process -FilePath '.\.venv\Scripts\activate.bat' -NoNewWindow

Write-Host "Opening VSCode ..."
code .

Write-Host "Happy coding!"