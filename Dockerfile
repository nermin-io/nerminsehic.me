FROM node:20 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20 AS production

WORKDIR /app

COPY --from=builder /app .

RUN npm install -g pnpm

RUN pnpm install --prod

ENV NODE_ENV=production

EXPOSE 8080

CMD ["pnpm", "start"]
