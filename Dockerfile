FROM python:3

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./Ml-model\ and\ Backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY ./Ml-model\ and\ Backend ./

CMD [ "python", "app.py" ]

FROM node:14-slim

WORKDIR /user/client/src/app

COPY ./client/package.json ./
COPY ./client/package-lock.json ./
RUN npm install

COPY ./client .

EXPOSE 3000

CMD ["npm", "start"]
