import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { ProductionDataAgent } from './production-agent';
import { API_RESPONSES } from './config';
import { Env, getAppController } from "./core-utils";
import { hashPassword, verifyPassword } from "./auth";
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import Stripe from 'stripe';
import type { User } from "./types";

const getUserId = async (c: any): Promise<string | null> => {
    const token = getCookie(c, 'auth_token');
    if (!token) return null;
    try {
        const decoded = await verify(token, c.env.JWT_SECRET);
        return decoded.sub as string;
    } catch (error) {
        return null;
    }
};
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), c.req.raw));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // --- AUTH ROUTES ---
    const auth = new Hono<{ Bindings: Env }>();
    auth.post('/signup', async (c) => {
        const { email, password, name } = await c.req.json();
        if (!email || !password || !name) return c.json({ success: false, error: 'Name, email and password are required' }, 400);
        const controller = getAppController(c.env);
        const hashedPassword = await hashPassword(password);
        const user = await controller.registerUser(email, hashedPassword, name);
        if (!user) return c.json({ success: false, error: 'User with this email already exists' }, 409);
        const payload = { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
        const token = await sign(payload, c.env.JWT_SECRET);
        setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
        return c.json({ success: true, data: { id: user.id, email: user.email, name } });
    });
    auth.post('/login', async (c) => {
        const { email, password } = await c.req.json();
        if (!email || !password) return c.json({ success: false, error: 'Email and password are required' }, 400);
        const controller = getAppController(c.env);
        const user = await controller.getUserByEmail(email);
        if (!user || !user.hashedPassword) return c.json({ success: false, error: 'Invalid credentials' }, 401);
        const isPasswordValid = await verifyPassword(password, user.hashedPassword);
        if (!isPasswordValid) return c.json({ success: false, error: 'Invalid credentials' }, 401);
        const payload = { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
        const token = await sign(payload, c.env.JWT_SECRET);
        setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
        const { hashedPassword, ...userData } = user;
        return c.json({ success: true, data: userData });
    });
    auth.post('/logout', (c) => {
        deleteCookie(c, 'auth_token', { path: '/' });
        return c.json({ success: true });
    });
    app.get('/api/auth/session', async (c) => {
        const userId = await getUserId(c);
        if (!userId) return c.json({ success: false, error: 'Not authenticated' }, 401);
        const controller = getAppController(c.env);
        const user = await controller.getUserById(userId);
        if (!user) return c.json({ success: false, error: 'User not found' }, 404);
        return c.json({ success: true, data: user });
    });
    app.route('/api/auth', auth);
    // --- DATA ROUTE ---
    app.all('/api/data/:userId/*', async (c) => {
        const authUserId = await getUserId(c);
        const requestedUserId = c.req.param('userId');
        if (!authUserId || authUserId !== requestedUserId) return c.json({ success: false, error: 'Forbidden' }, 403);
        const agent = await getAgentByName<Env, ProductionDataAgent>(c.env.PRODUCTION_DATA_AGENT, authUserId);
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/data/${authUserId}`, '');
        return agent.fetch(new Request(url.toString(), c.req.raw));
    });
    // --- STRIPE ROUTES ---
    const stripe = new Hono<{ Bindings: Env }>();
    const priceIds = { pro: 'price_1Pgx5cRvuKZyL2sQ1F2G3H4I', premium: 'price_1Pgx5cRvuKZyL2sQJkLmnOpQ' }; // Replace with your actual Price IDs
    stripe.post('/create-checkout-session', async (c) => {
        const userId = await getUserId(c);
        if (!userId) return c.json({ success: false, error: 'Not authenticated' }, 401);
        const { priceId } = await c.req.json();
        if (!Object.values(priceIds).includes(priceId)) return c.json({ success: false, error: 'Invalid price ID' }, 400);
        const stripeClient = new Stripe(c.env.STRIPE_API_KEY);
        const controller = getAppController(c.env);
        let user = await controller.getUserById(userId);
        if (!user) return c.json({ success: false, error: 'User not found' }, 404);
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripeClient.customers.create({ email: user.email, metadata: { userId: user.id } });
            customerId = customer.id;
            await controller.updateUser(userId, { stripeCustomerId: customerId });
        }
        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${c.env.APP_URL}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${c.env.APP_URL}/dashboard/settings`,
            subscription_data: { trial_period_days: 14 }
        });
        return c.json({ success: true, data: { sessionId: session.id, url: session.url } });
    });
    stripe.post('/create-portal-session', async (c) => {
        const userId = await getUserId(c);
        if (!userId) return c.json({ success: false, error: 'Not authenticated' }, 401);
        const controller = getAppController(c.env);
        const user = await controller.getUserById(userId);
        if (!user?.stripeCustomerId) return c.json({ success: false, error: 'Stripe customer not found' }, 404);
        const stripeClient = new Stripe(c.env.STRIPE_API_KEY);
        const portalSession = await stripeClient.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${c.env.APP_URL}/dashboard/settings`,
        });
        return c.json({ success: true, data: { url: portalSession.url } });
    });
    stripe.post('/webhook', async (c) => {
        const stripeClient = new Stripe(c.env.STRIPE_API_KEY);
        const signature = c.req.header('stripe-signature');
        if (!signature) return new Response('No signature', { status: 400 });
        try {
            const event = await stripeClient.webhooks.constructEvent(await c.req.text(), signature, c.env.STRIPE_WEBHOOK_SECRET);
            const controller = getAppController(c.env);
            if (event.type.startsWith('customer.subscription.')) {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripeClient.customers.retrieve(customerId);
                if (customer.deleted) return c.json({ received: true });
                const userId = customer.metadata.userId;
                if (!userId) return c.json({ received: true });
                const user = await controller.getUserById(userId);
                if (user) {
                    const status = subscription.status as User['subscriptionStatus'];
                    await controller.updateUser(user.id, {
                        subscriptionPlan: subscription.items.data[0].price.id === priceIds.pro ? 'pro' : 'premium',
                        subscriptionStatus: status,
                    });
                }
            }
            return c.json({ received: true });
        } catch (err) {
            return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
        }
    });
    app.route('/api/stripe', stripe);
}