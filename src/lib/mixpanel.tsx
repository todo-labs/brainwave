import React, { createContext, useContext, useEffect } from "react";
import Mixpanel from "mixpanel-browser";
import { useSession } from "next-auth/react";

import { env } from "@/env.mjs";
import useStore from "@/hooks/useStore";

Mixpanel.init(env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  api_host: `https://brainwave.quest/mp`,
});

export const mixpanelEventConfig = {
  PageView: "Page View" as const,
  ButtonClick: "Button Click" as const,
  FormSubmission: "Form Submission" as const,
  ViewedModal: "Viewed Modal" as const,
  Login: "Login" as const,
  Logout: "Logout" as const,
  Input: "Input" as const,
};

export type MixpanelPayload = {
  label: string;
  value: unknown;
  error: unknown;
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
};

export function MixpanelProvider({ children }: Props) {
  const { data: session } = useSession();
  const { currentStep } = useStore();

  useEffect(() => {
    if (!env.NEXT_PUBLIC_MIXPANEL_ENABLED) return;
    Mixpanel.identify(session?.user?.id);
    Mixpanel.people.set({
      $email: session?.user?.email,
      $name: session?.user?.name,
      lang: session?.user?.lang,
    });

    trackEvent("PageView", {
      label: window.location.pathname,
      ...(currentStep &&
        window.location.pathname === "/home" && { step: currentStep }),
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

  const contextValue = { trackEvent };

  return (
    <MixpanelContext.Provider value={contextValue}>
      {children}
    </MixpanelContext.Provider>
  );
}

export function useMixpanel() {
  return useContext(MixpanelContext);
}
