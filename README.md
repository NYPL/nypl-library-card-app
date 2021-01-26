# NYPL Library Card App

A Universal JavaScript Application that allows NYPL Patrons to request a library card and create an account. The front-end is built with React, the back-end uses Node/Express to communicates with other services, via the API gateway which handles validating & creating
a patron record.

## URL

https://www.nypl.org/library-card/new/

## Version

> 0.6.1

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

1. `NODE_ENV=production npm build`
2. `PORT=3001 NODE_ENV=production npm start`

### Environment Variables

See `.env.example` for a checklist of the environment variables the app
needs to run.

Note: Nextjs uses `.env.development` and `.env.production` for their respective platform environment variables. The keys are not encrypted in the repo and are therefore directly added/updated through the AWS Elastic Beanstalk UI.

## Deployment

### Reverse Proxy and basePath

NYPL.org serves many apps on separate subdomains through a reverse proxy. They all live in the nypl.org domain and typically this isn't an issue since each app has its own assets directory. But, for Nextjs apps, the `_next` directory is used for assets. In order to route the correct assets to the correct app, the app will be assigned a base path so all page routes and assets are fetched from there.

The `basePath` value is set to `/library-card`.

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

## Accessibility

There are two ways to use the `react-axe` package for accessibility review while developing. This is the package of choice used in a few NYPL React applications. Only turn it on when needed and not while developing all the time because it uses a lot of browser resouces.

1. Run `NEXT_PUBLIC_USE_AXE=true npm run dev`
2. or update the `NEXT_PUBLIC_USE_AXE` environment variable in your `.env` file.

## Docker

_Note_: This application is using Docker only for production builds and not for local development. For local development, the `npm run dev` command is the way to go.

### Building Docker Images

To build a Docker image for this application, run:

```
$ docker build -t lib-app .
```

This command will build an image tagged (`-t`) as `lib-app` using the current directory. Any changes to the application will require a new tagged image to be created to view those changes. Either remove the existing image (copy the image ID to use in the `docker image rm` command) and run the same command above:

```
$ docker images
REPOSITORY   TAG             IMAGE ID       CREATED         SIZE
lib-app      latest          13d71a1860bd   2 minutes ago   441MB

$ docker image rm 13d71a1860bd
$ docker build -t lib-app .
```

Or, create a new image:

```
$ docker build -t lib-app-2 .
```

This will be used to build and deploy images to Docker Hub in the future.

### Running a Docker Image

#### docker run

If you are using the `docker` CLI tool, use the following command to run an _existing_ image in a container called `mycontainer` locally:

```
$ docker run -d --name mycontainer -p 3000:3000 --env-file .env.local lib-app
```

This will run an existing Docker image, such as the image built from the previous step, in the background. If you want to see the latest logs from the container, run `docker logs mycontainer`. If you want to see the full set of logs as the Docker image is being built and run, remove the detached `-d` flag. The `--env-file` flag configures the docker container to use the local `.env.local` file where your secret credentials to run the app should be located. This file is not used when building the image, only when running the container.

To stop a Docker container, run:

```
$ docker stop mycontainer
```

### docker-compose

The application can also be used with the `docker-compose` CLI tool. This command will read the local `docker-compose.yml` file and build the container using the local `Dockerfile` file. This is similar to running both `docker build ...` and `docker run ...` except it's all encapsulated in one command. `docker-compose` is typically used to orchestrate multiple containers running together. The Library Card App only needs one container for Next.js but the command is still useful since you only need to remember one command.

To build and run the application, run:

```
$ docker-compose up
```

To stop and remove the container run:

```
$ docker-compose down
```

If any changes are made to the application, the image needs to be built again. Stop the container and then run the following command:

```
$ docker-compose up --build
```

If you want to stop a container but not remove it, run:

```
$ docker-compose stop
```

and the following to restart the stopped container:

```
$ docker-compose start
```

### Current Limitation

The Library Card App makes use of cookies to create, store, send, and verify CSRF tokens to prevent malicious attacks through the app's forms. In production builds, the CSRF token is stored in a secure cookie. Secure cookies require the use of https so unless your localhost is set up to run https, the production Docker builds will not work locally. This is an issue since running `npm run build` and `npm start` also create secure cookies and require localhost to support https. Although this is a problem for testing the production build of the application locally, this is not an issue when deploying to NYPL's production server.

1. HTTPs, Non-Docker, Local production build

To test https and secure cookies locally in a non-Docker environment, you need to create local SSL certificates and run a custom server that runs Nextjs. The following is for Mac users based on [this blog post](https://medium.com/responsetap-engineering/nextjs-https-for-a-local-dev-server-98bb441eabd7).

Run the following to create local certificate files using OpenSSL in a `./certificates` directory:

```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -days 365 \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Then double-click on the `localhost.crt` file to add it to your keychain. Change the settings to "Always Trust".

Now run `npm run local-prod` to build and run the Next.js app with https.

2. HTTP, Docker, Local production build

To test the docker image locally, in `/src/utils/api.ts` temporary comment out

```
if (!csrfTokenValid) {
  return invalidCsrfResponse(res);
}
```

in three separate locations. Then, build the image and run a container for that image. This will allow you to run the docker image locally in production mode with HTTPS turned off so that. This should not be deployed to production so remember to uncomment the code for a qa or production deployment.
