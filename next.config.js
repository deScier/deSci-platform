/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config, { isServer }) => {
      const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

      config.module.rules.push(
         // Reapply the existing rule, but only for svg imports ending in ?url
         {
            ...fileLoaderRule,
            test: /\.svg$/i,
            resourceQuery: /url/ // *.svg?url
         },
         // Convert all other *.svg imports to React components
         {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            resourceQuery: { not: /url/ }, // exclude if *.svg?url
            use: ['@svgr/webpack']
         }
      )

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i

      return config
   },
   compiler: {
      removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? true : false
   },
   images: {
      remotePatterns: [
         {
            hostname: 'source.unsplash.com'
         },
         {
            hostname: 'random.imagecdn.app'
         },
         {
            hostname: 'descier-tcc.s3.sa-east-1.amazonaws.com'
         }
      ]
   },
   env: {
      WEB3AUTH_CLIENT_ID: process.env.WEB3AUTH_CLIENT_ID,
      WEB3AUTH_CLIENT_ID_TEST: process.env.WEB3AUTH_CLIENT_ID_TEST,
      ALCHEMY_API_URL: process.env.ALCHEMY_API_URL,
      ALCHEMY_API_URL_TEST: process.env.ALCHEMY_API_URL_TEST
   },
   // See more in: https://nextjs.org/docs/app/api-reference/next-config-js/redirects
   async redirects() {
      return [
         {
            source: '/',
            destination: '/summary',
            permanent: true
         }
      ]
   }
}

module.exports = nextConfig
