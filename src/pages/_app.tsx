import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-wrapper";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head.js";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from 'react-error-boundary'

import "@/styles/globals.css";
import "src/styles/verify-request.css";

import { api } from "@/lib/api";
import { MixpanelProvider } from "@/lib/mixpanel";
import nextI18NextConfig from "../../next-i18next.config.js";
import { Button } from "@react-email/components";

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
      <MixpanelProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) => (
                  <div>
                    There was an error!
                    <Button onClick={resetErrorBoundary}>
                      Try again
                    </Button>
                  </div>
                )}
              >
                <main className={cn(dmSans.className)}>
                  <Head>
                    <title>Brainwave</title>
                    <link rel="icon" href="/logo.svg" />
                  </Head>
                  <Component {...pageProps} />
                  <Toaster />
                </main>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </ThemeProvider>
      </MixpanelProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp, nextI18NextConfig));
