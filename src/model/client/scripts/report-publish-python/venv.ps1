python --version

Write-Host "Creating a virtual environment  ..."
py -3 -m venv .venv

Write-Host "Activating virtual environment  ..."
Start-Process -FilePath '.\.venv\Scripts\activate.bat' -NoNewWindow

Write-Host "Creating a requirements.txt and main.py file ..."
Out-File ".\main.py" -Encoding utf8
pip freeze > requirements.txt

Write-Host "Opening VSCode ..."
code .

Write-Host "Happy coding!"