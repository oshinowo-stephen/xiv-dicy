FROM node:alpine AS docker_build

WORKDIR /usr/builds/xiv-dicy

ENV DATABASE_URL=file:storage/dicy.db

COPY bot/dist ./dist/
COPY config/prod.ts ./config/
COPY bot/package-lock.json bot/package.json ./
COPY bot/prisma/schema.prod.prisma ./prisma/schema.prod.prisma

RUN npm i -g npm
RUN npm ci --omit=dev --ignore-scripts --legacy-peer-deps
RUN npx prisma migrate dev --name staging --schema ./prisma/schema.prod.prisma

FROM alpine

WORKDIR /usr/apps/xiv-dicy

COPY --from=docker_build /usr/builds/xiv-dicy/ /usr/apps/xiv-dicy/

RUN apk add --update nodejs

CMD [ "node", "./dist/index.js" ]