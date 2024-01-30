# Build the environment.
FROM node:10.2.0-alpine

# Install git to resolve issues installing the
# nypl/dgx-header-component package.
RUN apk update 
RUN apk add git

WORKDIR /

# Set environment variables. NODE_ENV is set early because we
# want to use it when running `npm install` and `npm run build`.
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT=3000 \
    NODE_ENV=production

# Install dependencies.
COPY package.json ./
RUN npm install

# Copy the app files.
COPY . ./

EXPOSE 3000

# Build the app!
RUN npm run build 

# CMD is the default command when running the docker container.
CMD npm start
