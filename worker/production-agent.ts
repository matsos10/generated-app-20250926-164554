import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ProductionDataState } from './types';
import { API_RESPONSES } from './config';
// Realistic mock data generator
const createMockData = (): ProductionDataState => ({
  kpis: [
    { title: "Overall Equipment Effectiveness", value: "85%", change: "+2.1% from last month" },
    { title: "Active Predictive Alerts", value: "3", change: "1 new alert today" },
    { title: "Machines Online", value: "48 / 50", change: "96% uptime" },
    { title: "Avg. Downtime", value: "12 mins", change: "-5% from last month" },
  ],
  alerts: [
    { id: "ALT-001", machine: "CNC-Mill-01", alertType: "Vibration Anomaly", severity: "Critical", timestamp: "2024-07-21 08:15:23", status: "Active" },
    { id: "ALT-002", machine: "Lathe-03", alertType: "Temperature Spike", severity: "High", timestamp: "2024-07-21 07:45:10", status: "Active" },
    { id: "ALT-003", machine: "Robot-Arm-05", alertType: "Pressure Drop", severity: "Medium", timestamp: "2024-07-20 22:30:05", status: "Acknowledged" },
    { id: "ALT-004", machine: "Conveyor-02", alertType: "Motor Overload", severity: "High", timestamp: "2024-07-20 18:00:45", status: "Resolved" },
    { id: "ALT-005", machine: "CNC-Mill-01", alertType: "Coolant Level Low", severity: "Low", timestamp: "2024-07-20 15:12:30", status: "Resolved" },
  ],
  tasks: [
    { id: "TSK-001", taskName: "Milling Part A", machine: "CNC-Mill-01", startTime: "08:00", endTime: "12:00", status: "In Progress" },
    { id: "TSK-002", taskName: "Drilling Part B", machine: "CNC-Mill-02", startTime: "09:00", endTime: "13:00", status: "In Progress" },
    { id: "TSK-003", taskName: "Turning Part C", machine: "Lathe-03", startTime: "12:00", endTime: "15:00", status: "Upcoming" },
    { id: "TSK-004", taskName: "Assembly Part D", machine: "Robot-Arm-05", startTime: "13:00", endTime: "16:00", status: "Upcoming" },
    { id: "TSK-005", taskName: "Milling Part E", machine: "CNC-Mill-01", startTime: "15:00", endTime: "18:00", status: "Upcoming" },
  ],
  defects: [
    { id: "DEF-001", product: "Gearbox-A1", defectType: "Structural", severity: "Critical", timestamp: "2024-07-21 10:05:11", status: "Investigating" },
    { id: "DEF-002", product: "Housing-B2", defectType: "Cosmetic", severity: "Minor", timestamp: "2024-07-21 09:50:34", status: "Resolved" },
    { id: "DEF-003", product: "Circuit-C3", defectType: "Functional", severity: "Major", timestamp: "2024-07-21 09:30:00", status: "Investigating" },
    { id: "DEF-004", product: "Bearing-D4", defectType: "Structural", severity: "Major", timestamp: "2024-07-20 16:22:01", status: "Resolved" },
    { id: "DEF-005", product: "Panel-E5", defectType: "Cosmetic", severity: "Minor", timestamp: "2024-07-20 14:01:56", status: "Resolved" },
  ],
});
export class ProductionDataAgent extends Agent<Env, ProductionDataState> {
  initialState: ProductionDataState = createMockData();
  async onStart(): Promise<void> {
    // In a real app, you might fetch initial state from a DB
    // For now, we just use the mock data
    console.log(`ProductionDataAgent ${this.name} initialized.`);
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === '/all') {
      return Response.json({ success: true, data: this.state });
    }
    if (path === '/kpis') {
      return Response.json({ success: true, data: this.state.kpis });
    }
    if (path === '/alerts') {
      return Response.json({ success: true, data: this.state.alerts });
    }
    if (path === '/tasks') {
      return Response.json({ success: true, data: this.state.tasks });
    }
    if (path === '/defects') {
      return Response.json({ success: true, data: this.state.defects });
    }
    return Response.json({ success: false, error: API_RESPONSES.NOT_FOUND }, { status: 404 });
  }
}