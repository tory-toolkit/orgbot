FROM node:10
COPY . /App
WORKDIR /App
RUN make build && make bot-start
