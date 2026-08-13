FROM node:26-alpine

WORKDIR /app

COPY ./account-ui/package*.json ./

RUN npm install

COPY ./account-ui/. .

EXPOSE 5173

# this docker is for DEV, PRODUCTION `npx vite build` and serve from nginx as static files
CMD ["npx", "vite", "--host", "0.0.0.0", "--mode", "development"]