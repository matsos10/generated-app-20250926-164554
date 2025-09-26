export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}
export interface MCPResult {
  content: string;
}
export interface ErrorResult {
  error: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
  streamingMessage?: string;
}
export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}
export interface User {
  id: string;
  email: string;
  name?: string;
  hashedPassword?: string;
  createdAt: number;
  // Stripe fields
  stripeCustomerId?: string;
  subscriptionPlan?: 'pro' | 'premium';
  subscriptionStatus?: 'active' | 'trialing' | 'paused' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired';
}
// --- New Production Data Types ---
export interface Kpi {
  title: string;
  value: string;
  change: string;
}
export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
export type AlertStatus = "Active" | "Acknowledged" | "Resolved";
export interface MaintenanceAlert {
  id: string;
  machine: string;
  alertType: string;
  severity: AlertSeverity;
  timestamp: string;
  status: AlertStatus;
}
export type TaskStatus = "Upcoming" | "In Progress" | "Completed";
export interface ProductionTask {
  id: string;
  taskName: string;
  machine: string;
  startTime: string;
  endTime: string;
  status: TaskStatus;
}
export type DefectType = "Cosmetic" | "Functional" | "Structural";
export type DefectSeverity = "Critical" | "Major" | "Minor";
export type DefectStatus = "Investigating" | "Resolved";
export interface QualityDefect {
  id: string;
  product: string;
  defectType: DefectType;
  severity: DefectSeverity;
  timestamp: string;
  status: DefectStatus;
}
export interface ProductionDataState {
  kpis: Kpi[];
  alerts: MaintenanceAlert[];
  tasks: ProductionTask[];
  defects: QualityDefect[];
}