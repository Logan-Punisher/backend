FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY packages* .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
