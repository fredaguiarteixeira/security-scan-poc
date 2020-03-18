FROM node:lts-alpine

WORKDIR /app
RUN set -ex && \
    adduser node root && \
    apk add --update --no-cache \
      # sonar-scanner
      openjdk8-jre \
      curl

COPY . .

RUN npm install
RUN npm run build

USER node
EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["run", "server"]
