import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, User } from './types';
import type { Env } from './core-utils';
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private users = new Map<string, User>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const storedSessions = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      this.sessions = new Map(Object.entries(storedSessions));
      const storedUsers = await this.ctx.storage.get<Record<string, User>>('users') || {};
      this.users = new Map(Object.entries(storedUsers));
      this.loaded = true;
    }
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  private async persistUsers(): Promise<void> {
    await this.ctx.storage.put('users', Object.fromEntries(this.users));
  }
  // User Management
  async registerUser(name: string, email: string, hashedPassword: string):Promise<User | null> {
    await this.ensureLoaded();
    if (Array.from(this.users.values()).some(u => u.email === email)) {
      return null; // User already exists
    }
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      hashedPassword,
      createdAt: Date.now(),
    };
    this.users.set(user.id, user);
    await this.persistUsers();
    const { hashedPassword: _, ...safeUser } = user;
    return safeUser;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureLoaded();
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user || null;
  }
  async getUserById(id: string): Promise<User | null> {
    await this.ensureLoaded();
    const user = this.users.get(id);
    if (!user) return null;
    const { hashedPassword, ...safeUser } = user;
    return safeUser;
  }
  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    await this.ensureLoaded();
    const user = this.users.get(userId);
    if (!user) return null;
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    await this.persistUsers();
    const { hashedPassword, ...safeUser } = updatedUser;
    return safeUser;
  }
  // Session Management
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persistSessions();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async getSession(sessionId: string): Promise<SessionInfo | null> {
    await this.ensureLoaded();
    return this.sessions.get(sessionId) || null;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persistSessions();
    return count;
  }
}