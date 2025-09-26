import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Star, Loader2 } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useStripeSubscription } from "@/hooks/use-stripe-subscription";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { User } from "../../worker/types";
const SubscriptionDetails = () => {
  const { user } = useAuthStore();
  const { isLoading, redirectToPortal } = useStripeSubscription();
  const getStatusVariant = (status?: User['subscriptionStatus']) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'default';
      case 'past_due':
      case 'unpaid':
      case 'incomplete':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  if (!user?.subscriptionPlan || user.subscriptionStatus === 'canceled' || user.subscriptionStatus === 'incomplete_expired') {
    return (
      <CardContent className="text-center flex flex-col items-center justify-center h-48">
        <p className="mb-4 text-muted-foreground">You are currently on the Free plan.</p>
        <Button asChild>
          <Link to="/#pricing">Upgrade to Pro</Link>
        </Button>
      </CardContent>
    );
  }
  return (
    <>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold flex items-center capitalize">
              {user.subscriptionPlan} Plan
              <Star className="w-4 h-4 ml-2 text-yellow-500 fill-yellow-500" />
            </h3>
            <Badge variant={getStatusVariant(user.subscriptionStatus)} className="capitalize mt-1">{user.subscriptionStatus?.replace('_', ' ')}</Badge>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{user.subscriptionPlan === 'pro' ? '$49/month' : '$99/month'}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Included in your plan:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> {user.subscriptionPlan === 'pro' ? '10 Projects' : 'Unlimited Projects'}</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Advanced Analytics</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Predictive Maintenance AI</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> {user.subscriptionPlan === 'pro' ? 'Email Support' : 'Priority Phone Support'}</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={redirectToPortal} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Manage Subscription
        </Button>
      </CardFooter>
    </>
  );
};
export function SettingsPage() {
  const { user } = useAuthStore();
  const { isLoading, redirectToPortal } = useStripeSubscription();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings, subscription, and billing information.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Make changes to your personal information here. Click save when you're done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name || 'NexusFlow User'} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your current subscription plan.</CardDescription>
            </CardHeader>
            <SubscriptionDetails />
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage your billing history and download invoices from the Stripe customer portal.</p>
            </CardContent>
             <CardFooter>
                <Button onClick={redirectToPortal} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  View Billing Portal
                </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}