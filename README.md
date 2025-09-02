# NYPL Library Card App

A JavaScript Application that allows NYPL patrons to request a library card and create an account. The front-end is built with React, the back-end uses Node/Express to communicates with other services, via the API gateway which handles validating & creating a patron record.

| Table of Contents |                                                                   |
| ----------------- | ----------------------------------------------------------------- |
| 1.                | [Production Site and Version](#production-site-and-version)       |
| 2.                | [Branch Statuses](#branch-statuses)                               |
| 3.                | [Installation and Configuration](#installation-and-configuration) |
| 4.                | [Deployment](#deployment)                                         |
| 5.                | [Git Workflow](#git-workflow)                                     |
| 6.                | [Internationalization](#internationalization)                     |
| 7.                | [CI/CD](#CI/CD)                                                   |
| 8.                | [Docker](#docker)                                                 |
| 9.                | [Testing](#testing)                                               |

## Production Site and Version

The production site on NYPL.org:

- https://www.nypl.org/library-card/new/

The current production version:

- v1.2.4

## Branch Statuses

| Branch       | Status                                                                                                                                      |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `main`       | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=main)](https://travis-ci.org/NYPL/nypl-library-card-app)       |
| `production` | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=production)](https://travis-ci.org/NYPL/nypl-library-card-app) |
| `qa`         | [![Build Status](https://travis-ci.org/NYPL/nypl-library-card-app.svg?branch=qa)](https://travis-ci.org/NYPL/nypl-library-card-app)         |

## Installation & Configuration

### Node Version Manager (nvm)

Developers can use [nvm](https://github.com/creationix/nvm) if they wish.
This repo has a `.nvmrc` file that indicates which node version we develop against.
For more information see [how `nvm use` works](https://github.com/creationix/nvm#nvmrc).

At the moment, this app is intended to be run on Node v10.x due to AWS deployments.

### Environment Variables

See `.env.example` for a checklist of the environment variables the app
needs to run. Ask developer for credentials or their .env.local file

Note: Nextjs uses `.env.development` and `.env.production` for their respective platform environment variables. The keys are not encrypted in the repo and are therefore directly added/updated through Terraform. These files are not not necessary to have to run the app locally.

### Install & Running Locally

1. `cp .env.example .env.local` and fill out variables
2. `npm install`
3. `npm run dev` and point browser to http://localhost:3000/library-card/new

#### NOTE

When you type `npm run dev` the CLI will output a line:
`react-i18next:: You will need to pass in an i18next instance by using initReactI18next`. This is safe to ignore.

You MUST point the browser to http://localhost:3000/library-card/new. Do NOT point the browser to http://localhost:3000 with no route. If you do, you will throw an error related to i18next. It expects a `dir` prop in the same element as the `_next` prop.

### Production build

To build and run the app locally in production mode, run the following:

1. `npm run build`
2. `npm start`

Make sure that `PORT=3001` and `NODE_ENV=production` is set in the `.env.local` file or run the commands as:

1. `NODE_ENV=production npm build`
2. `PORT=3001 NODE_ENV=production npm start`

## Deployment

### Reverse Proxy and basePath

NYPL.org serves many apps on separate subdomains through a reverse proxy. They all live in the nypl.org domain and typically this isn't an issue since each app has its own assets directory. But, for Nextjs apps, the `_next` directory is used for assets. In order to route the correct assets to the correct app, the app will be assigned a base path so all page routes and assets are fetched from there.

The `basePath` value is set to `/library-card`.

## Git Workflow

Our branches (in order of stability are):

| Branch     | Environment | AWS Account     |
| :--------- | :---------- | :-------------- |
| main       | development | aws-sandbox     |
| qa         | qa          | aws-digital-dev |
| production | production  | aws-digital-dev |

The `main` branch and the `development` environment on `aws-sandbox` is not currently being used. Only the deployments to `aws-digital-dev` are being used.

### Cutting a feature branch

1. Feature branches are cut off from `main`
2. Once the feature branch is ready to be merged, file a pull request of the feature branch _into_ `main`.

`main` ==gets merged to==> `qa` ==gets merged into==> `production`.

The `qa` branch should be what's running in the QA environment.
The `production` branch should be what's running in the production environment.

## Internationalization

The application is internationalized using the `next-i18next` package. For more information, see the [MULTILINGUAL_FEATURE.md](./MULTILINGUAL_FEATURE.md) file.

## CI/CD

Subsequent deployments are accomplished via pushing code into `qa` and `production` branches, which triggers GitHub Actions to build, test, and deploy.

Configuration can be adjusted via `.github/workflows/ci.yml`, located at the root directory of this code repository. GitHub Actions is set to watch `qa` and `production` branches and waits for code push, e.g. `git push origin qa` will trigger GitHub Actions to build. When build and test are successful, GitHub Actions will deploy to specified ECS instance.

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

#### docker-compose

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

## Testing
This project uses Playwright for functional, UI, and end-to-end (E2E) testing. Playwright allows you to write and run automated tests across multiple browsers to ensure the application works as expected.

Follow the steps below to set up Playwright and run tests.

Install Playwright locally by running the following command:
```npx playwright install```

Run all Playwright tests with
```npm run playwright```

Run specific Playwright tests with
```npm run playwright -- new.spec.ts```
or
```npm run playwright -- -g "has title"```
or
```npm run playwright -- tests/new.spec.ts tests/personal.spec.ts```

Run Playwright tests in headed mode with
```npm run playwright -- --headed```

Debug Playwright tests with the GUI tool that can be opened with
```npm run playwright -- --ui```

Update Playwright to the latest version with
```npm install -D @playwright/test@latest```