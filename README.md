# NYPL Library Card App - Alpha

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

### AWS Elastic Beanstalk
1. `.ebextensions` directory needed at application's root directory
2. `.ebextensions/environment.config` to store environment variables. For environment variables that needs to be hidden, use `eb setenv ENV_VAR1=value1 ENV_VAR2=value2...` on command line.
3. `.ebextensions/nodecommand.config` to start node app after deployment.
4. `eb init -i --profile <<your AWS profile>>`
5. Initial creation of instance on Beanstalk:
`eb create <<environment name>> -i <<size of instance>> --cname <<cname prefix>> --vpc.id <<ask for custom vpc_id>> --vpc.ec2subnets <<ask for subnets by vpc_id>> --profile <<your AWS profile>>`
6. Subsequent deployment
`eb deploy <<environment name>> --profile <<your AWS profile>>`