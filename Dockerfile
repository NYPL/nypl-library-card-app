# build environment
FROM node:12.2.0-alpine as builder

# Copy the app files
WORKDIR /
COPY . ./

# Install dependencies
RUN npm install

# Set some standard ENV
ENV PORT=3000 \
    NODE_ENV=production
EXPOSE $PORT

# CMD will set the default command that
# is run when running the docker container.
# In this case, we run eb:start to
# build the app with our env vars, delete
# unnecessary files, and start the app.
CMD npm run eb:start