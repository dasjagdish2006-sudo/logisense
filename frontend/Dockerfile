FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

HEALTHCHECK --interval=20s --timeout=5s --retries=8 --start-period=25s \
    CMD wget -qO- http://127.0.0.1:5173/ >/dev/null || exit 1

CMD ["npm", "run", "dev"]
