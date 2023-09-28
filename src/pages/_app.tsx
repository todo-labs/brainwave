import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-wrapper";
import { Toaster } from "@/components/ui/toaster";

import nextI18NextConfig from "../../next-i18next.config.js";

import "@/styles/globals.css";
import "src/styles/verify-request.css";
import { api } from "@/lib/api";
import Head from "next/head.js";
import { MixpanelProvider } from "@/lib/mixpanel";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MixpanelProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main className={cn(dmSans.className)}>
            <Head>
              <title>Brainwave</title>
              <link rel="icon" href="/logo.svg" />
            </Head>
            <Component {...pageProps} />
            <Toaster />
          </main>
        </ThemeProvider>
      </MixpanelProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp, nextI18NextConfig));
