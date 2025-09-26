import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useStripeSubscription } from '@/hooks/use-stripe-subscription';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
export function PricingTable() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
  const { isLoading, redirectToCheckout } = useStripeSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'premium' | null>(null);
  const { isAuthenticated } = useAuthStore();
  const handleCheckout = (plan: 'pro' | 'premium') => {
    setSelectedPlan(plan);
    redirectToCheckout(plan);
  };
  const plans = [
    {
      name: t('pricing.basic.name'),
      priceMonthly: t('pricing.basic.price'),
      priceAnnually: t('pricing.basic.price'),
      description: t('pricing.basic.description'),
      features: [t('pricing.basic.feature1'), t('pricing.basic.feature2'), t('pricing.basic.feature3')],
      isFeatured: false,
      planId: null,
    },
    {
      name: t('pricing.pro.name'),
      priceMonthly: t('pricing.pro.price'),
      priceAnnually: '$39',
      description: t('pricing.pro.description'),
      features: [t('pricing.pro.feature1'), t('pricing.pro.feature2'), t('pricing.pro.feature3'), t('pricing.pro.feature4')],
      isFeatured: true,
      planId: 'pro',
    },
    {
      name: t('pricing.premium.name'),
      priceMonthly: t('pricing.premium.price'),
      priceAnnually: '$79',
      description: t('pricing.premium.description'),
      features: [t('pricing.premium.feature1'), t('pricing.premium.feature2'), t('pricing.premium.feature3'), t('pricing.premium.feature4')],
      isFeatured: false,
      planId: 'premium',
    },
  ];
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-center space-x-4 mb-12">
        <Label htmlFor="billing-cycle">{t('pricing.monthly')}</Label>
        <Switch id="billing-cycle" checked={isAnnual} onCheckedChange={setIsAnnual} />
        <Label htmlFor="billing-cycle" className="flex items-center">
          {t('pricing.annually')}
          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            {t('pricing.annually.badge')}
          </span>
        </Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className={cn('flex flex-col h-full', plan.isFeatured && 'border-primary shadow-lg')}>
              <CardHeader className="pb-4">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{isAnnual ? plan.priceAnnually : plan.priceMonthly}</span>
                  {plan.planId && <span className="text-muted-foreground">/ {isAnnual ? 'yr' : 'mo'}</span>}
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.planId ? (
                   isAuthenticated ? (
                    <Button
                      onClick={() => handleCheckout(plan.planId as 'pro' | 'premium')}
                      disabled={isLoading && selectedPlan === plan.planId}
                      className={cn('w-full', !plan.isFeatured && 'variant-outline')}
                      variant={plan.isFeatured ? 'default' : 'outline'}
                    >
                      {isLoading && selectedPlan === plan.planId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('pricing.cta')}
                    </Button>
                   ) : (
                    <Button asChild className={cn('w-full', !plan.isFeatured && 'variant-outline')} variant={plan.isFeatured ? 'default' : 'outline'}>
                      <Link to="/signup">{t('pricing.cta')}</Link>
                    </Button>
                   )
                ) : (
                  <Button disabled className="w-full" variant="outline">Current Plan</Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}