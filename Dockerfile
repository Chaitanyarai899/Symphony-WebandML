# Dockerfile

# Stage 1: Python server
FROM python:3 as server

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./Ml-model\ and\ Backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY ./Ml-model\ and\ Backend ./

CMD [ "python", "app.py" ]

# Stage 2: Node.js web client
FROM node:14-slim as client

WORKDIR /app

COPY ./client/package.json ./
COPY ./client/package-lock.json ./
RUN npm install

COPY ./client .

EXPOSE 3000

CMD ["npm", "start"]
