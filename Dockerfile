FROM node:10

ENV NODE_ENV production

# Create app directory
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install-server

WORKDIR /app/client
COPY client/package.json .
COPY client/yarn.lock .
RUN yarn install

# Build client first
COPY client .
RUN yarn build

# Then build server
WORKDIR /app
COPY . .
RUN yarn build-server

EXPOSE 80
CMD ["node", "dist/server/server.js"]