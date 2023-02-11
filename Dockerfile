FROM node:19-slim

WORKDIR /app

# Setup a path for using local npm packages
RUN mkdir -p /opt/node_modules

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]