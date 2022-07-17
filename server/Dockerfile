FROM node:16.16

WORKDIR /wise-old-man/server

COPY package*.json ./
RUN npm install -s
RUN prisma generate
RUN npm install pm2

COPY . .

RUN npm run build

CMD ["npm", "run", "prod"]