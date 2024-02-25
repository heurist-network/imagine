module.exports = {
  trailingSlash: true,
  transpilePackages: ["antd"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1dagtixswu0qn.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};
