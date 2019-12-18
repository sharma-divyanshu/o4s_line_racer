FROM node:latest

RUN mkdir -p /o4s
WORKDIR /o4s
COPY . .
CMD [ "node", "o4s/code/master.js" ]