FROM node:10
COPY . /App
WORKDIR /App
RUN npm ci
