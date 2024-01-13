import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'
import i18nextConfig from '@/next-i18next.config'

class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.query.locale ||
      i18nextConfig.i18n.defaultLocale
    const meta = {
      url: "https://heurist.vercel.app/",
      image: "https://heurist.vercel.app/BlazingDrive.png",
      socialImageURL: "https://heurist.vercel.app/BlazingDrive.png",
      title: 'Imagine | FREE Image generator by Heurist',
      description: 'We host best Stable Diffusion models on a decentralized network of GPUs and offer them for free'
    };
    return (
      <Html lang={currentLocale}>
        <Head>
          <link href="/reset.css" rel="stylesheet" />
          <link href="/app.css" rel="stylesheet" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:title" content={meta.title} key="title" />
          <meta property="og:description" content={meta.description} key="description" />

          <meta name="title" content={meta.title} />
          <meta name="description" content={meta.description} />
          <meta name="author" content="https://heurist.xyz" />
          <meta name="keywords" content="Stable Diffusion, Image Generation, AI, Art" />
          <meta name="generator" content="https://heurist.xyz" />

          <meta property="og:type" content='website' />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={meta.url} />
          <meta property="og:image" content={meta.socialImageURL} />

          <meta property="twitter:card" content='summary_large_image' />
          <meta property="twitter:title" content={meta.title} />
          <meta property="twitter:description" content={meta.description} />
          <meta property="twitter:url" content={meta.url} />
          <meta property="twitter:image" content={meta.socialImageURL} />

          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
