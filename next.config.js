/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
  webpack: (config, { isServer }) => {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
          },
        },
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  compiler: {
    removeConsole: false,
    // removeConsole: process.env.NODE_ENV === 'production' ? true : false
  },
  images: {
    remotePatterns: [
      {
        hostname: 'source.unsplash.com',
      },
      {
        hostname: 'random.imagecdn.app',
      },
      {
        hostname: 'descier-tcc.s3.sa-east-1.amazonaws.com',
      },
      {
        hostname: 'aquamarine-used-mule-633.mypinata.cloud',
      },
      {
        hostname: 'descier.mypinata.cloud',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  env: {
    WEB3AUTH_CLIENT_ID: process.env.WEB3AUTH_CLIENT_ID,
    WEB3AUTH_CLIENT_ID_TEST: process.env.WEB3AUTH_CLIENT_ID_TEST,
    ALCHEMY_API_URL: process.env.ALCHEMY_API_URL,
    ALCHEMY_API_URL_TEST: process.env.ALCHEMY_API_URL_TEST,
    GOOGLE_ID: process.env.GOOGLE_ID,
    WEB3AUTH_VERIFIER: process.env.WEB3AUTH_VERIFIER,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.platform.desci.reviews',
  },
  // See more in: https://nextjs.org/docs/app/api-reference/next-config-js/redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/summary',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
