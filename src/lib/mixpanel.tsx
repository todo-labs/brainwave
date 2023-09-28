import React, { createContext, useContext, useEffect } from "react";
import Mixpanel from "mixpanel-browser";

import { env } from "@/env.mjs";
import { Session } from "next-auth";

Mixpanel.init(env.NEXT_PUBLIC_MIXPANEL_TOKEN);

export const mixpanelEventConfig = {
  PageView: "Page View" as const,
  ButtonClick: "Button Click" as const,
  FormSubmission: "Form Submission" as const,
  ViewedModal: "Viewed Modal" as const,
  Login: "Login" as const,
  Logout: "Logout" as const,
  Search: "Search" as const,
  Filter: "Filter" as const,
  Sort: "Sort" as const,
};

export type MixpanelPayload = {
  is_error: boolean;
  label: string;
  [key: string]: any;
};

type TrackEvent = (
  event: keyof typeof mixpanelEventConfig,
  properties?: Partial<MixpanelPayload>
) => void;

const MixpanelContext = createContext({
  trackEvent: (() => {}) as TrackEvent,
});

type Props = {
  children: React.ReactNode;
  session?: Session | null;
};

export function MixpanelProvider({ children, session }: Props) {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_MIXPANEL_ENABLED) return;
    Mixpanel.identify(session?.user?.id);
    Mixpanel.people.set({
      $email: session?.user?.email,
      $name: session?.user?.name,
    });

    trackEvent("PageView", {
      label: window.location.pathname,
    });

    return () => {
      Mixpanel.reset();
    };
  }, [session, env.NEXT_PUBLIC_MIXPANEL_ENABLED]);

  function trackEvent(
    event: keyof typeof mixpanelEventConfig,
    properties?: Partial<MixpanelPayload>
  ) {
    if (!env.NEXT_PUBLIC_MIXPANEL_ENABLED) return;
    Mixpanel.track(mixpanelEventConfig[event], properties);
  }

  const contextValue = {
    trackEvent,
  };

  return (
    <MixpanelContext.Provider value={contextValue}>
      {children}
    </MixpanelContext.Provider>
  );
}

export function useMixpanel() {
  return useContext(MixpanelContext);
}
