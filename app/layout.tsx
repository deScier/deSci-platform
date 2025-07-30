import 'keen-slider/keen-slider.min.css';
import 'react-toastify/dist/ReactToastify.min.css';

import '@styles/globals.css';
import '@styles/toast.css';
import '@styles/utils.css';

import { TooltipProvider } from '@/lib/tooltip';
import type { Metadata } from 'next';
import { Slide, ToastContainer } from 'react-toastify';
import { AuthProvider } from './auth-provider';

import ProgressBar from '@/lib/nprogress';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://desci.reviews'),
  title: {
    default: 'deSci Publications - Decentralized Science',
    template: '%s | deSci Publications',
  },
  description:
    'A decentralized science-DeSci publishing platform uses blockchain technology and smart contracts to enable the publication and distribution of academic papers.',
  keywords: [
    'DeSci',
    'blockchain',
    'scientific publishing',
    'academic papers',
    'decentralized science',
    'research',
    'peer review',
  ],
  authors: [{ name: 'deSci Platform Team' }],
  creator: 'deSci Platform',
  publisher: 'deSci Publications',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    type: 'website',
    siteName: 'deSci Publications',
    title: 'deSci Publications - Decentralized Science',
    description:
      'A decentralized science-DeSci publishing platform uses blockchain technology and smart contracts to enable the publication and distribution of academic papers.',
    images: [
      {
        url: '/images/de-scier-plataform.png',
        width: 1200,
        height: 630,
        alt: 'deSci Publications Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'deSci Publications',
    description: 'Decentralized Science Publishing Platform',
    images: ['/images/de-scier-plataform.png'],
    creator: '@desciers',
    site: '@desciers',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
          fetchPriority="high"
        />
      </head>
      <body>
        <ProgressBar />
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
        <ToastContainer transition={Slide} draggable />
      </body>
    </html>
  );
}