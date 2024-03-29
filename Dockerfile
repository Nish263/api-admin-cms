FROM node:16-alpine
WORKDIR /user/src/app
COPY package* ./
RUN npm install
COPY . ./

EXPOSE 8000

CMD ["node", "server.js"]