FROM node:latest as node
WORKDIR /app
COPY ./frontend/  .
RUN mkdir -p dist
RUN npm install -g npm@8.7.0
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/ /usr/share/nginx/html/
COPY ./deployment/frontend/nginx.conf /etc/nginx/conf.d/default.conf