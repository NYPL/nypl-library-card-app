# NYPL Library Card App

A Universal JavaScript Application that allows NYPL Patrons to request a library card and create an account. The front-end is built with React, the back-end uses Node/Express to communicates with other services, via the API gateway which handles validating & creating
a patron record.

## URL

https://www.nypl.org/library-card/new/

## Version

> 0.6.0

| Branch       | Status                                                                                                                                      |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `main`       | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=main)](https://travis-ci.org/NYPL/nypl-library-card-app)       |
| `production` | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=production)](https://travis-ci.org/NYPL/nypl-library-card-app) |
| `qa`         | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=qa)](https://travis-ci.org/NYPL/nypl-library-card-app)         |

## Installation & Configuration

### Node Version Manager (nvm)

Developers can use [nvm](https://github.com/creationix/nvm) if they wish.
This repo has a `.nvmrc` file that indicates which node version we development against.
For more information see [how `nvm use` works](https://github.com/creationix/nvm#nvmrc).

### Install & Running Locally

1. `cp .env.example .env.local` and fill out variables
2. `npm install`
3. `npm run dev` and point browser to http://localhost:3000/library-card/new

#### Production build

To build and run the app locally in production mode, run the following:

1. `npm run build`
2. `npm start`

Make sure that `PORT=3001` and `NODE_ENV=production` is set in the `.env.local` file or run the commands as:

1. `PORT=3001 NODE_ENV=production npm build`
2. `PORT=3001 NODE_ENV=production npm start`

### Environment Variables

See `.env.example` for a checklist of the environment variables the app
needs to run.

Note: Nextjs uses `.env.development` and `.env.production` for their respective platform environment variables. The keys are not encrypted in the repo and are therefore directly added/updated through the AWS Elastic Beanstalk UI.

## Deployment

### Git Workflow

Our branches (in order of stability are):

| Branch     | Environment | AWS Account     |
| :--------- | :---------- | :-------------- |
| main       | development | aws-sandbox     |
| qa         | qa          | aws-digital-dev |
| production | production  | aws-digital-dev |

Notice that since QA is calling QA endpoint of Card Creator (via QA Patron Creator Service) and currently (April/2019) QA endpoint of Card Creator is down, any request from QA is not working and will return a 503 error.

### Cutting a feature branch

1. Feature branches are cut off from `main`
2. Once the feature branch is ready to be merged, file a pull request of the feature branch _into_ `main`.

`main` ==gets merged to==> `qa` ==gets merged into==> `production`.

The `main` branch should be what's running in the Development environment.

The `qa` branch should be what's running in the QA environment.
The `production` branch should be what's running in the production environment.

### Accessibility

There are two ways to use the `react-axe` package for accessibility review while developing. This is the package of choice used in a few NYPL React applications. Only turn it on when needed and not while developing all the time because it uses a lot of browser resouces.

1. Run `NEXT_PUBLIC_USE_AXE=true npm run dev`
2. or update the `NEXT_PUBLIC_USE_AXE` environment variable in your `.env` file.

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
