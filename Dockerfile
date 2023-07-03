FROM python:3

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./Ml-model and Backend/requirements.txt ./

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "app.py" ]

FROM node:14-slim

WORKDIR /user/client/src/app

COPY . /package.json ./

COPY . /package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]