# /fe/Purple-Duck-nextJs/project/Dockerfile
# Sử dụng base image của Node.js
# Giai đoạn 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json và package-lock.json (hoặc yarn.lock)
# Cần copy tất cả source code và package.json trước khi chạy npm install
# Điều này đảm bảo tất cả các dependencies được cài đặt
COPY . .

# Cài đặt dependencies
RUN npm install --frozen-lockfile

# Build ứng dụng Next.js cho chế độ standalone
# Lệnh này giờ sẽ chạy thành công vì tất cả dependencies đã được cài đặt
RUN npm run build

# Giai đoạn 2: Runtime image nhỏ gọn
FROM node:22-alpine

WORKDIR /app

# Copy thư mục standalone từ stage builder
# Thư mục standalone chứa server Node.js và các file cần thiết
COPY --from=builder /app/.next/standalone ./
# Copy thư mục public (chứa các assets tĩnh)
COPY --from=builder /app/public ./public

# Expose cổng mà Next.js server sẽ chạy (mặc định là 3000)
EXPOSE 3000

# Command để chạy ứng dụng Next.js
CMD ["node", "server.js"]
