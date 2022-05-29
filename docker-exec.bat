docker build -t strisys/web-application-quick-start:latest .
start http://localhost:8080
docker container prune --filter "label=name=webapplicationquickstart" --force
docker run -p 8080:3000 strisys/web-application-quick-start:latest

pause