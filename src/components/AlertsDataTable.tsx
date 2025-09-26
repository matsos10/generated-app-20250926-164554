import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MaintenanceAlert } from "../../worker/types";
interface AlertsDataTableProps {
  alerts: MaintenanceAlert[];
}
const severityClasses = {
  Critical: "bg-red-500 hover:bg-red-600",
  High: "bg-orange-500 hover:bg-orange-600",
  Medium: "bg-yellow-500 hover:bg-yellow-600 text-black",
  Low: "bg-blue-500 hover:bg-blue-600",
};
const statusClasses = {
  Active: "border-red-500 text-red-500",
  Acknowledged: "border-yellow-500 text-yellow-500",
  Resolved: "border-green-500 text-green-500",
};
export function AlertsDataTable({ alerts }: AlertsDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Machine</TableHead>
          <TableHead>Alert Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id}>
            <TableCell className="font-medium">{alert.machine}</TableCell>
            <TableCell>{alert.alertType}</TableCell>
            <TableCell>
              <Badge className={cn("text-white", severityClasses[alert.severity])}>
                {alert.severity}
              </Badge>
            </TableCell>
            <TableCell>{alert.timestamp}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn(statusClasses[alert.status])}>
                {alert.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}