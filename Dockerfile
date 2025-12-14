FROM node:20-alpine

WORKDIR /app

COPY src/building-blocks/ src/building-blocks/
WORKDIR /app/src/building-blocks

RUN npm install

RUN npm run build

ARG SERVICE_PATH
WORKDIR /app/$SERVICE_PATH

COPY $SERVICE_PATH .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]
