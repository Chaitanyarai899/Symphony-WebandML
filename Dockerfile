FROM node:14-slim

WORKDIR /user/src/app

COPY . /client/package.json ./

COPY . /client/package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]