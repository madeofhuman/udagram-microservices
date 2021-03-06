FROM node:14

RUN apt-get update -y && apt-get install -y zip unzip
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "prod"]
