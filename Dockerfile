FROM node:18.12.1 as base

RUN mkdir /app
WORKDIR /app

FROM base as build

COPY package*.json ./
RUN npm install

FROM node:18.12.1 as dev

ENV NODE_ENV=development

COPY --from=build /app/node_modules ./node_modules

WORKDIR /app

COPY . .

CMD ["npm", "dev"]