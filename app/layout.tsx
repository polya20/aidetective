import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/context/SessionProvider";
import { getServerSession } from "next-auth";
import NavBar from "@/components/layout/navbar";
import { authOptions } from "@/utils/authOptions";
import SWRProvider from "@/context/SWRProvider";
import { ToastProvider } from "@/context/ToastProvider";
import { Footer } from "./component/footer";
import { PHProvider, PostHogPageview } from "@/context/PostHogProvider";
import { Suspense } from "react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Top AI tools for your assistance",
  description: "Top AI tools for your assistance",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b91d47" />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <meta name="theme-color" content="#b91d47" />
      </head>
      <body className={`bg-ui-bg-base text-ui-fg-base ${inter.className}`}>
        <ToastProvider />
        <Suspense>
          <PostHogPageview />
        </Suspense>
        <PHProvider>
          <SessionProvider session={session}>
            <SWRProvider>
              <NavBar />
              {children}
              <Footer />
            </SWRProvider>
          </SessionProvider>
        </PHProvider>
      </body>
    </html>
  );
}
