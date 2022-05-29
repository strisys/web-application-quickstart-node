FROM node:18.2.0 as build-stage

RUN echo 'transferrring context ...' >> /build-log.txt
WORKDIR /app
COPY ./build-image.sh .
COPY ./src .

RUN echo 'running build script ...' >> /build-log.txt
RUN bash build-image.sh

RUN echo 'starting final stage ...' >> /build-log.txt
FROM node:18.2.0-alpine as final-stage

LABEL name="webapplicationquickstart"
LABEL version="0.1"
LABEL maintaner="webapplicationquickstart@strisys.com"
EXPOSE 3000

WORKDIR /app
COPY --from=build-stage /build-log.txt .
COPY --from=build-stage /app .
RUN ls -l >> ./build-log.txt
# CMD cat ./build-log.txt
WORKDIR /app/server
ENTRYPOINT ["npm", "run", "run-server"]