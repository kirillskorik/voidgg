FROM node:18-alpine3.17

WORKDIR /app

EXPOSE 4200

# Set npm version (can be removed if using the default npm version from the Node.js image)
RUN npm install -g npm@latest

COPY ./package.json .
COPY ./.env.prod ./.env

# Install dependencies using npm
RUN npm install

COPY ./ ./

EXPOSE $PORT

# Build your application
RUN npm run build

# Start your application
CMD npm run start:prod
