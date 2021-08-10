FROM node:15.5.1

WORKDIR /app

COPY . .

RUN npm install
CMD ["node", "src/index.js"]