FROM node:22 AS builder

# Create app directory
WORKDIR /api

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:22

WORKDIR /api

COPY --from=builder /api/node_modules ./node_modules
COPY --from=builder /api/package*.json ./
COPY --from=builder /api/dist ./dist

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]