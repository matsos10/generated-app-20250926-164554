import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertsDataTable } from "@/components/AlertsDataTable";
import { MachineHealthChart } from "@/components/charts/MachineHealthChart";
import useProductionDataStore from "@/hooks/use-production-data";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export function MaintenancePage() {
  const { alerts, isLoading, fetchData } = useProductionDataStore();
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Predictive Maintenance</h1>
        <p className="text-muted-foreground">Monitor machine health and manage predictive alerts.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Machine Health Trend (CNC-Mill-01)</CardTitle>
            <CardDescription>
              Real-time temperature and vibration data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : <MachineHealthChart />}
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Failure Prediction</CardTitle>
            <CardDescription>
              AI-powered failure probability for CNC-Mill-01.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full gap-4">
            {isLoading ? <Skeleton className="h-40 w-full" /> : (
              <>
                <div className="text-6xl font-bold text-red-500">82%</div>
                <p className="text-muted-foreground text-center">
                  Probability of bearing failure within the next 72 hours.
                </p>
                <p className="text-sm text-center">
                  <strong>Recommendation:</strong> Schedule maintenance immediately.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Alerts</CardTitle>
          <CardDescription>
            Active and historical alerts from all machines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-[200px] w-full" /> : <AlertsDataTable alerts={alerts} />}
        </CardContent>
      </Card>
    </div>
  );
}