FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm i 

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run start:dev"]