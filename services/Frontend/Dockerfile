FROM beevelop/ionic:latest AS ionic

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN ionic build --prod

FROM nginx:stable

COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html
COPY --from=ionic /usr/src/app/nginx.conf /etc/nginx/nginx.conf
