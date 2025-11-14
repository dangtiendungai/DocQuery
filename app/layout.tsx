import type { Metadata } from "next";
import { Sarala, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sarala = Sarala({
  variable: "--font-sarala",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "DocQuery · Retrieval-Augmented Answers",
  description:
    "Upload documents, chat with grounded answers, and keep every response cited with DocQuery.",
  openGraph: {
    title: "DocQuery · Retrieval-Augmented Answers",
    description:
      "Upload documents, chat with grounded answers, and keep every response cited with DocQuery.",
    url: "https://doc-query-six.vercel.app",
    siteName: "DocQuery",
    images: [
      {
        url: "https://doc-query-six.vercel.app/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DocQuery - Retrieval-Augmented Answers for your documents",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocQuery · Retrieval-Augmented Answers",
    description:
      "Upload documents, chat with grounded answers, and keep every response cited with DocQuery.",
    images: ["https://doc-query-six.vercel.app/opengraph-image"],
  },
  metadataBase: new URL("https://doc-query-six.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sarala.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
