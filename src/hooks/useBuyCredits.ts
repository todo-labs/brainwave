import { api } from "@/lib/api";
import { getStripe } from "@/lib/stripe";

export function useBuyCredits() {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      const response = await checkout.mutateAsync();
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe.js not loaded");
      }
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    },
  };
}
