## Installation

```bash
$ npm install
$ npm run generate-client
```

## Prerequisites
1. Node v22.11.0
2. MongoDB v8.0.1 running on port 27017
3. Docker v24.0.6

## Running the app
### To run the service locally, please make sure mongodb service is running on port 27017
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### To run service as a container, there's no need to have mongodb service running, just run:
```
$ docker-compose run -p 3000:3000 zendesk_coding_exercise npm run start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests.
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Loading initial data
To load some sample initial data on the database, do the following
1. Import the postman collection `ZenDesk Coding Challenge.postman_collection.json` into Postman.
2. Run the POST Populate Data endpoint to load the data into the DB.

## Testing the service
You can use the same imported Postman collection `ZenDesk Coding Challenge.postman_collection.json` to execute requests. The API spec for the service can be found in file `public/api-spec.yaml`

## Design consideration notes:
1. I tried finding different tools to generate replies from a given intent. In the end, I ended up using static mappings for intent<> reply.
2. The cardinality of intent<>reply is 1:n i.e. one intent can have multiple replies with different threshold. The same has been reflected in the DB design.
3. The internal folder has the data-populator service which load the initial data. I'm treating this like an internal script hence its not exposed in the api-spec.yaml.
4. The client generation for intentsApi happens through a openapi's client generator package. Though there exists a client wrapper over it too.
5. The service is written in NestJS to avoid the task of manually setting up things like http server, dependency injection, ts config, config management, code coverage, linting, MongoDB client, etc.
6. The method for /api/v1/reply is POST and not GET because getting long texts in GET params has its limitations
7. Logging is missing in the entire project as I couldn't find a way to make log visible in the console.
8. 
