# Build the environment
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

# CMD is the default command when running the docker container.
# `eb:start` will internally run `npm run build` and `npm start`.
CMD npm run eb:start