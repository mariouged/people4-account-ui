FROM node:26-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install react react-dom

RUN npm ci

COPY . .

# ENV ACCOUNT_API_HOST=${ACCOUNT_API_HOST}
# ENV ACCOUNT_API_PORT=${ACCOUNT_API_PORT}

EXPOSE 5173

#CMD ["npx", "vite", "--host", "172.31.0.5"]
#CMD ["npx", "vite", "--host", "172.31.0.5", "--mode", "development"]
CMD ["sh", "-c", "while true; do sleep 1; done"]
# npx vite --host 172.31.0.5 --mode development