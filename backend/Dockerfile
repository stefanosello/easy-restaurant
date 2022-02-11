FROM node:12.13.0-alpine
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "serve"]