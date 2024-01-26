FROM node:18.12.1

WORKDIR /api

COPY . /api

RUN yarn install --frozen-lockfile

ENTRYPOINT ["yarn", "run", "dev"]