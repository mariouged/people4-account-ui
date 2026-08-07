FROM node:26-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install react react-dom

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npx", "vite", "--host", "172.31.0.5"]
