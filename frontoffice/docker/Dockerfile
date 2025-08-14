FROM node:20.19.0-alpine3.20

WORKDIR /app

RUN apk add --no-cache bash

COPY nuxt.config.ts ./
COPY tsconfig.json ./
COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev"]