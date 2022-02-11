FROM node:15.14.0-alpine
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "serve"]