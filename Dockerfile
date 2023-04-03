FROM node:alpine AS docker_build

WORKDIR /usr/builds/lyralogs

COPY bot/dist ./dist/
COPY config/prod.ts ./config/
COPY bot/package-lock.json bot/package.json ./
COPY bot/prisma/schema.prisma ./prisma/schema.prisma

RUN npm i -g npm
RUN npm ci --omit=dev --ignore-scripts --legacy-peer-deps
RUN npx prisma migrate dev --name staging

FROM alpine

WORKDIR /usr/apps/lyralogs

COPY --from=docker_build /usr/builds/lyralogs/ /usr/apps/lyralogs/

RUN apk add --update nodejs

CMD [ "node", "./dist/index.js" ]