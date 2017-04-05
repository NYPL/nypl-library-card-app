# NYPL Library Card App - Alpha

The front end site that allows patrons to get a library card.
It is built with React and Express and communicates with other
services, via the API gateway to do that actual work of validating & creating
a patron / card.

### Installation

Installs all dependencies listed in package.json

1.  Set these environment variables (# TODO: use .env files in non-production mode)

|variable               |description                                 |
|---------------------  |--------------------------------------------|
|CLIENT_ID              |the username to access our OAuth provider as|
|CLIENT_SECRET          |the secret/pw for the OAuth provider        |
|NPM_CONFIG_PRODUCTION  |...                                         |
|NODE_ENV               |'production' shuts off hot-reloading, affects npm install|
|PATRON_CREATION_URL    |The URL used to create patrons (e.g: https://api.nypltech.org/api/v0.1/patrons) |
|PATRON_VALIDATION_URL  |The URL used to validate people's usernames and addresses (e.g: https://api.nypltech.org/api/v0.1/validations) |
|OAUTH_PROVIDER_URL     |URL to OAuth provider who guards the API Gateway (e.g: https://isso.nypl.org/oauth/token)|
|OAUTH_CLIENT_ID        |The ID this app uses to auth to the OAuth provider above|
|OAUTH_CLIENT_SECRET    |The secret this app uses to auth to the OAuth provider above|


2. `npm install`  

3.  `npm start` and point browser to http://localhost:3001/library-card
