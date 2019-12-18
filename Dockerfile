FROM node:latest

RUN mkdir -p /code
WORKDIR /code
COPY . .
CMD [ "node", "code/master.js" ]