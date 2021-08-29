FROM node:alpine

WORKDIR /app
COPY package.json /app/
RUN npm install -g ts-node typescript ts-node-dev
RUN npm install
COPY . .
EXPOSE 5000

CMD ["ts-node-dev","./src/app.ts"]