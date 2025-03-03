import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://ethfraudreport.com" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}