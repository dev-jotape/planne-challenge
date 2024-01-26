FROM node:18.12.1

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

WORKDIR /app

COPY . .

CMD ["yarn", "dev"]