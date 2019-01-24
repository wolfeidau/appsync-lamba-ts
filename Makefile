APPNAME ?= appsync-events
ENV ?= dev

default: lint lint-graphql test
.PHONY: default
ci: clean install lint lint-graphql test build
.PHONY: ci

lint:
	@npm run lint
.PHONY: lint

lint-graphql:
	@npm run lint-graphql
.PHONY: lint-graphql

install:
	@npm install
.PHONY: install

test:
	@npm test
.PHONY: test

build:
	@npm run build
.PHONY: build

# clean all the things
clean:
	@rm -rf ./dist
	@rm -f ./handler.zip
	@rm -f ./deploy.out.yml
.PHONY: clean

# package up the lambda and upload it to S3
package:
	echo "package lambdas into handler.zip"
	@(cp -R node_modules dist && cd dist && zip -q -9 -r ../handler.zip .)
	echo "Running as: $(shell aws sts get-caller-identity --query Arn --output text)"
	@aws cloudformation package \
		--template-file deploy.sam.yml \
		--output-template-file deploy.out.yml \
		--s3-bucket $(S3_BUCKET) \
		--s3-prefix sam
.PHONY: package

deploy:
	echo "Running as: $(shell aws sts get-caller-identity --query Arn --output text)"
	@aws cloudformation deploy --no-fail-on-empty-changeset \
		--stack-name "$(APPNAME)-$(ENV)" \
		--capabilities CAPABILITY_NAMED_IAM \
		--template-file ./deploy.out.yml \
		--parameter-overrides EnvironmentName=$(ENV)
.PHONY: deploy
