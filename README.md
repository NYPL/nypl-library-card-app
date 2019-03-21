# NYPL Library Card App

A Universal JavaScript Application that allows NYPL Patrons to request a library card and create an account. The front-end is built with React, the back-end uses Node/Express to communicates with other services, via the API gateway which handles validating & creating
a patron record.

## URL
https://www.nypl.org/library-card/new/

## Version
> 0.4.18

| Branch        | Status                                                                                                                                                   |
|:--------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `master`      | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=master)](https://travis-ci.org/NYPL/nypl-library-card-app)      |
| `production` | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=production)](https://travis-ci.org/NYPL/nypl-library-card-app) |
| `qa`  | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=qa)](https://travis-ci.org/NYPL/nypl-library-card-app)  |


## Installation & Configuration

### Node Version Manager (nvm)

Developers can use [nvm](https://github.com/creationix/nvm) if they wish.
This repo has a `.nvmrc` file that indicates which node version we development against.
For more information see [how `nvm use` works](https://github.com/creationix/nvm#nvmrc).

### Install & Running Locally

1. `cp .env.example .env` and fill out variables
2. `npm install`  
3. `npm start` and point browser to http://localhost:3001/library-card/new

### Environment Variables

See `.env.example` for a checklist of the environment variables the app
needs to run.

## Deployment

### Git Workflow

Our branches (in order of stability are):

| Branch      | Environment | AWS Account     |
|:------------|:------------|:----------------|
| master      | development | aws-sandbox     |
| qa          | qa          | aws-digital-dev |
| production  | production  | aws-digital-dev |

### Cutting a feature branch

1. Feature branches are cut off from `master`
2. Once the feature branch is ready to be merged, file a pull request of the feature branch _into_ `master`.

`master` ==gets merged to==> `qa` ==gets merged into==> `production`.

The `master` branch should be what's running in the Development environment.

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

### Travis CI

Subsequent deployments are accomplished via pushing code into `qa` and `production` branches, which triggers Travis CI to build, test, and deploy.

Configuration can be adjusted via `.travis.yml`, located at the root directory of this code repository. Travis CI is set to watch `qa` and `production` branches and waits for code push, e.g. `git push origin qa` will trigger Travis CI to build. When build and test are successful, Travis CI will deploy to specified Elastic Beanstalk instance.
