FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
COPY package*.json ./
RUN bun install
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80