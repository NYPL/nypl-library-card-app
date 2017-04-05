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
