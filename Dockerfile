FROM balenalib/raspberry-pi-alpine-node:latest

#RUN apk add --update npm
RUN addgroup -S node && adduser -S node -G node
RUN mkdir -p /usr/src

WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node" , "app.js"]