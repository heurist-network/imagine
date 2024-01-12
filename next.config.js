// const { i18n } = require('./next-i18next.config')

module.exports = {
  // i18n,
  trailingSlash: true,
  transpilePackages: ['antd'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-east-1.amazonaws.com',
        pathname: '/**',
      }
    ]
  }
}
