# NYPL Library Card App - Alpha

The front end site that allows patrons to get a library card.
It is built with React and Express and communicates with other
services, via the API gateway to do that actual work of validating & creating
a patron / card.

## Installation for Developers

Installs all dependencies listed in package.json

1. `cp .env.example .env` and fill out variables
2. `npm install`  
3. `npm start` and point browser to http://localhost:3001/library-card

## Environtment Variables

See `.env.example` for a checklist of the environment variables the app
needs to run.
