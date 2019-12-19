FROM node:10
COPY . /App
WORKDIR /App
RUN make && make bot-start
