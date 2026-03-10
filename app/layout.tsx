import { AppToaster } from "@/components/ui/toast"
import GlobalNavbar from "@/components/GlobalNavbar"
import Footer from "@/components/Footer"

import Script from "next/script"
import GoogleAnalyticsTracker from "@/components/GoogleAnalyticsTracker"

import "./globals.css"

export const metadata = {
  title: "Thibaut Vanden Eynden | Foodtracker",
  description: "Grafisch Ontwerp & Digitale Media - Class of '26",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>

      <body className="antialiased min-h-screen flex flex-col">
        {/* Google Analytics page view tracker */}
        <GoogleAnalyticsTracker />

        <GlobalNavbar />

        {/* De main content groeit om de footer naar beneden te duwen */}
        <main className="grow pt-24">
          {children}
        </main>

        {/* De footer staat nu gewoon onderaan de content stroom */}
        <Footer />

        <AppToaster />
      </body>
    </html>
  )
}