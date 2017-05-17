# NYPL Library Card App

The front end site that allows patrons to get a library card.
It is built with React and Express and communicates with other
services, via the API gateway to do that actual work of validating & creating
a patron / card.

## Installation & Configuration

### nvm

Developers can use [nvm](https://github.com/creationix/nvm) if they wish.
This repo has a `.nvmrc` file that indicates which node version we development against.
For more information see [how `nvm use` works](https://github.com/creationix/nvm#nvmrc).

### install and running

1. `cp .env.example .env` and fill out variables
2. `npm install`  
3. `npm start` and point browser to http://localhost:3001/library-card

## Environtment Variables

See `.env.example` for a checklist of the environment variables the app
needs to run.

## Deployment

### Git Strategy

`master` is stable but bleeding edge. Cut feature branches off of `master`.
Send PRs to be merged into `master`.

`master` ==gets merged to==> `qa` ==gets merged into==> `production`.

The `qa` branch should be what's running in the QA environment.
The `production` branch should be what's running in the production environment.

### AWS Elastic Beanstalk
1. `.ebextensions` directory needed at application's root directory
2. `.ebextensions/environment.config` to store environment variables. For environment variables that needs to be hidden,
3. `.ebextensions/nodecommand.config` to start node app after deployment.
4. `eb init -i --profile <<your AWS profile>>`
5. Initial creation of instance on Beanstalk:

Please use the instance profile of _cloudwatchable-beanstalk_.
Which has all the permissions needed for a traditional or Docker-flavored Beanstalk
machine that wants to log to CloudWatch.

```bash
eb create <<environment name>> --instance_type <<size of instance>> \
    --instance_profile cloudwatchable-beanstalk \
    --envvars FOO="bar",MYVAR="myval" \
    --cname <<cname prefix (XXX.us-east-1.elasticbeanstalk.com)>> \
    --vpc.id <<ask for custom vpc_id>> \
    --vpc.ec2subnets <<privateSubnetId1,privateSubnetId2>> \
    --vpc.elbsubnets <<publicSubnetId1,publicSubnetId2>> \
    --vpc.elbpublic \
    --profile <<your AWS profile>>
```

6. Subsequent deployment
`eb deploy <<environment name>> --profile <<your AWS profile>>`

## Changelog

### v0.2.0
> Added react-router to the appliaction for handling multiple pages.
> Added tests for <BarcodeContainer> and its related functions.
> Updated the client side input field validation to be activated on blur.
