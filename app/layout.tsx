import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import localFont from 'next/font/local'

const pretendard = localFont({
  src: './font/pretendard-variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${pretendard.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href={`${basePath}/static/favicons/apple-icon-57x57.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href={`${basePath}/static/favicons/apple-icon-60x60.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href={`${basePath}/static/favicons/apple-icon-72x72.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-icon-76x76.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href={`${basePath}/static/favicons/apple-icon-114x114.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href={`${basePath}/static/favicons/apple-icon-120x120.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href={`${basePath}/static/favicons/apple-icon-144x144.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`${basePath}/static/favicons/apple-icon-152x152.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${basePath}/static/favicons/apple-icon-180x180.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href={`${basePath}/static/favicons/android-icon-192x192.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href={`${basePath}/static/favicons/favicon-96x96.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />

      <link rel="manifest" href="/manifest.json" />
      {/* <meta name="msapplication-TileColor" content="#ffffff" /> */}
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      {/* <meta name="theme-color" content="#ffffff" /> */}

      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <meta name="google-site-verification" content="_dXogOT6KbenCn54aGEMMuXeW7mLZQs4g6rNUCfFZGM" />
      <meta name="naver-site-verification" content="85eb0719d0fb34eb97b2207649b5344cb4bffc7c" />

      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />

      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
