# Giai đoạn 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# TỐI ƯU HÓA 1: Tách riêng để tận dụng cache của Docker.
# Bước này chỉ chạy lại khi package.json thay đổi.
COPY package*.json ./
RUN npm install --frozen-lockfile

# Sau khi cài dependencies, mới copy source code.
COPY . .

# Build ứng dụng
RUN npm run build

# Giai đoạn 2: Runtime
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV production

# Copy các file cần thiết từ stage builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
# TỐI ƯU HÓA 2: Bổ sung copy thư mục static để không mất CSS/JS
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
