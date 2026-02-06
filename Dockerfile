FROM node:20-alpine

RUN apk add --no-cache bash postgresql-client

WORKDIR /app

COPY . .

RUN chmod +x /app/docker-entrypoint.sh || true

EXPOSE 3333

CMD ["/app/docker-entrypoint.sh"]
