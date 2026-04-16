FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine AS production

RUN apk add --no-cache vips-dev

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm rebuild sharp

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/uploads

EXPOSE 4000

CMD ["node", "dist/main"]
