import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionScheduleChart } from "@/components/charts/ProductionScheduleChart";
import { UpcomingTasksTable } from "@/components/UpcomingTasksTable";
import useProductionDataStore from "@/hooks/use-production-data";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export function SchedulingPage() {
  const { tasks, isLoading, fetchData } = useProductionDataStore();
  useEffect(() => {
    if (tasks.length === 0) {
      fetchData();
    }
  }, [fetchData, tasks.length]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Scheduling Optimization</h1>
        <p className="text-muted-foreground">Visualize and manage your AI-optimized production schedule.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Production Schedule</CardTitle>
          <CardDescription>
            Gantt chart view of tasks scheduled across machines for the current shift.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-[400px] w-full" /> : <ProductionScheduleChart />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>
            A detailed list of tasks scheduled for production.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-[200px] w-full" /> : <UpcomingTasksTable tasks={tasks} />}
        </CardContent>
      </Card>
    </div>
  );
}