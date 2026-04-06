# Stage 1 — build the React frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Stage 2 — production image
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY --from=builder /app/client/dist ./client/dist

# Data directory (override with a volume mount)
RUN mkdir -p /data

EXPOSE 3011
CMD ["node", "server.js"]
