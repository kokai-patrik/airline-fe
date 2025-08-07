ARG NODE_VERSION=22.17.1-alpine

FROM node:${NODE_VERSION} AS build

WORKDIR /app

COPY ./package.json /app/
COPY ./package-lock.json /app/

RUN npm install

COPY . ./

RUN npm run build

FROM node:${NODE_VERSION}

WORKDIR /app

COPY --from=build /app/.output ./

ENV HOST=0.0.0.0 NODE_ENV=production
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node","/app/server/index.mjs"]
