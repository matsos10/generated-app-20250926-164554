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
import type { QualityDefect } from "../../worker/types";
interface DefectsDataTableProps {
  defects: QualityDefect[];
}
const severityClasses = {
  Critical: "bg-red-500 hover:bg-red-600",
  Major: "bg-orange-500 hover:bg-orange-600",
  Minor: "bg-yellow-500 hover:bg-yellow-600 text-black",
};
const statusClasses = {
  Investigating: "border-orange-500 text-orange-500",
  Resolved: "border-green-500 text-green-500",
};
export function DefectsDataTable({ defects }: DefectsDataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product ID</TableHead>
          <TableHead>Defect Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defects.map((defect) => (
          <TableRow key={defect.id}>
            <TableCell className="font-medium">{defect.product}</TableCell>
            <TableCell>{defect.defectType}</TableCell>
            <TableCell>
              <Badge className={cn("text-white", severityClasses[defect.severity])}>
                {defect.severity}
              </Badge>
            </TableCell>
            <TableCell>{defect.timestamp}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn(statusClasses[defect.status])}>
                {defect.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}