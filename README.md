# appsync-lambda-ts

This project is an example project which illustrates how to build an [AppSync](https://aws.amazon.com/appsync/) [Lambda](https://aws.amazon.com/lambda/) data source using [Typescript](https://www.typescriptlang.org/).

# Features

This project has a basic handler, with an example test using [Jest](https://jestjs.io/). It is deployed using an [AWS SAM](https://github.com/awslabs/serverless-application-model) file which creates the AppSync API, Lambda and a DynamoDB table.

# Tools

This tooling this project uses is as follows:

* [AWS SAM](https://github.com/awslabs/serverless-application-model)
* [tslint](https://palantir.github.io/tslint/)
* [graphql-schema-linter](https://github.com/cjoudrey/graphql-schema-linter)

# Usage

This project uses a basic `Makefile` to automate tasks.

To build the project for the first time run, this will run `npm install`, lint, test and build your code

```
make ci
```

To deploy the project you will require a staging bucket exported as `S3_BUCKET` environment variable, then you can run.

```
make package deploy
```

# Conventions

Throughout the code you will see reference to environments, this convention enables you to run a group of dependent components which are linked together based on:

* EnvironmentName Name of the environment could be dev, test or prod.
* EnvironmentNumber Number for the environment, Typically 1 - n.

The other convention used is the linking of cloudformation stacks by passing in the name of a stack, rather than nesting or the like. This takes advantage of imports / exports, which you can read about at Exporting Stack Output Values

# Authors

* Mark Wolfe [@wolfeidau](https://twitter.com/wolfeidau)

# License

This project is released under Apache 2.0 License.
