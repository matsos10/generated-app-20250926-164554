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
import type { ProductionTask } from "../../worker/types";
interface UpcomingTasksTableProps {
  tasks: ProductionTask[];
}
const statusClasses = {
  "Upcoming": "border-blue-500 text-blue-500",
  "In Progress": "border-yellow-500 text-yellow-500",
  "Completed": "border-green-500 text-green-500",
};
export function UpcomingTasksTable({ tasks }: UpcomingTasksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Machine</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.taskName}</TableCell>
            <TableCell>{task.machine}</TableCell>
            <TableCell>{task.startTime}</TableCell>
            <TableCell>{task.endTime}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn(statusClasses[task.status])}>
                {task.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}