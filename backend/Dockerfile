FROM node:20-alpine

WORKDIR /app

COPY my-vite-project/backend/package*.json ./
RUN npm install

COPY my-vite-project/backend/ ./

EXPOSE 5000

CMD ["node", "server.js"]
