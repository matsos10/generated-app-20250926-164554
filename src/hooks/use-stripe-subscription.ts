import { useState } from 'react';
import { toast } from 'sonner';
export const useStripeSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const redirectToCheckout = async (plan: 'pro' | 'premium') => {
    setIsLoading(true);
    try {
      // Replace with your actual Price IDs from Stripe Dashboard
      const priceMap = {
        pro: 'price_1Pgx5cRvuKZyL2sQ1F2G3H4I',
        premium: 'price_1Pgx5cRvuKZyL2sQJkLmnOpQ',
      };
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceMap[plan] }),
      });
      const session = await response.json();
      if (!response.ok || !session.success || !session.data.url) {
        throw new Error(session.error || 'Could not create checkout session.');
      }
      window.location.href = session.data.url;
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  };
  const redirectToPortal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });
      const session = await response.json();
      if (!response.ok || !session.success || !session.data.url) {
        throw new Error(session.error || 'Could not create portal session.');
      }
      window.location.href = session.data.url;
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, redirectToCheckout, redirectToPortal };
};