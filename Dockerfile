FROM openapitools/openapi-generator-cli:v7.10.0 AS generator
COPY ./src/intents-interpreter/intents-interpreter.api.yaml /intents-api-spec.yaml

RUN bash /usr/local/bin/docker-entrypoint.sh generate -i=/intents-api-spec.yaml -g=typescript-fetch -o=/intents-api-generated

FROM node:22.11.0-alpine

EXPOSE 3000

ENV NODE_ENV=prd

RUN mkdir -p /zendesk-coding-exercise

ADD . /zendesk-coding-exercise
WORKDIR /zendesk-coding-exercise

COPY . .
COPY --from=generator /intents-api-generated ./generated/intents-api

RUN npm i --omit=dev && npm i -g @nestjs/cli 
