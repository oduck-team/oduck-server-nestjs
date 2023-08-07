FROM node:18.17
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8000
CMD [ "npm", "run", "start:dev" ]