/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Thêm 'res.cloudinary.com' và 'example.com' vào mảng domains
    domains: ['images.pexels.com', 'res.cloudinary.com', 'example.com'],
    // Bạn cũng nên thêm remotePatterns cho các hostname mới để rõ ràng hơn,
    // hoặc chỉ dùng domains nếu không cần kiểm soát pathname/port/protocol quá chi tiết.
    // Việc sử dụng cả domains và remotePatterns cho cùng một hostname là dư thừa
    // nếu remotePatterns đã bao phủ toàn bộ hostname.
    // Tuy nhiên, để tuân thủ theo cấu trúc hiện tại của bạn, tôi sẽ thêm cả hai.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      { // THÊM CẤU HÌNH CHO CLOUDINARY
        protocol: 'http', // Đôi khi Cloudinary trả về http, cần kiểm tra URL thực tế
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      { // THÊM CẤU HÌNH CHO EXAMPLE.COM (nếu bạn dùng các URL mẫu này)
        protocol: 'https', // Các URL mẫu của bạn dùng https
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig