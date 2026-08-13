FROM node:26-alpine

WORKDIR /app

COPY ./account-ui/package*.json ./

RUN npm install

COPY ./account-ui/. .

EXPOSE 5173

#CMD ["npx", "vite", "--host", "172.32.0.30"]
# PROD npx vite build && move to nginx container
#CMD ["npx", "vite", "--host", "172.32.0.30", "--mode", "development"]
CMD ["sh", "-c", "while true; do sleep 1; done"]
# docker compose exec account-ui sh -c "npx vite --host 172.32.0.30 --mode development"