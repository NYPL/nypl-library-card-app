# NYPL Library Card App

A Universal JavaScript Application that allows NYPL Patrons to request a library card and create an account. The front-end is built with React, the back-end uses Node/Express to communicates with other services, via the API gateway which handles validating & creating
a patron record.

## Version
> 0.2.1

## Installation & Configuration

### NVM

Developers can use [nvm](https://github.com/creationix/nvm) if they wish.
This repo has a `.nvmrc` file that indicates which node version we development against.
For more information see [how `nvm use` works](https://github.com/creationix/nvm#nvmrc).

### Install & Running Locally

1. `cp .env.example .env` and fill out variables
2. `npm install`  
3. `npm start` and point browser to http://localhost:3001/library-card/new

### Environtment Variables

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

### v0.3.2
#### Updated
> Updated header to 2.1.0.
> Removed email as a required field.

### v0.3.1

### v0.3.0

### v0.2.1
#### Added
> Added support for NYS agency_type via URL parameter.
#### Updated
> Updated Patron Model to handle default and NYS agency type ID's.

### v0.2.0
#### Added
> Added react-router to the application for handling multiple pages.
> Added tests for <BarcodeContainer> and it's related functions.
> Added related functions for the email validation from server side.
#### Updated
> Updated the client side input field validation to be activated on blur.
> Updated the route for barcode service. It is commented out for current release.
> Updated server side validation, server error messages will be displayed in <ErrorBox> if client side validations fails.
