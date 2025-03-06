/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API設定
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL
          ? `${process.env.API_URL}/:path*`
          : 'http://mock-api:3001/:path*' // Docker環境でのモックAPI
      }
    ];
  },
  // 必要に応じてその他の設定を追加
};

module.exports = nextConfig;