import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { ProductionOutputChart } from "@/components/charts/ProductionOutputChart";
import useProductionDataStore from "@/hooks/use-production-data";
import { AIChat } from "@/components/AIChat";
export function DashboardPage() {
  const { kpis, isLoading, fetchData } = useProductionDataStore();
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const kpiIcons: { [key: string]: React.ElementType } = {
    "Overall Equipment Effectiveness": Activity,
    "Active Predictive Alerts": AlertTriangle,
    "Machines Online": CheckCircle,
    "Avg. Downtime": Clock,
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Here's a real-time overview of your production floor.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isLoading ? Array(4).fill({}) : kpis).map((kpi, index) => {
          const Icon = kpi.title ? kpiIcons[kpi.title] : null;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{isLoading ? <Skeleton className="h-4 w-3/4" /> : kpi.title}</CardTitle>
                { !isLoading && Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Production Output</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             {isLoading ? <Skeleton className="h-[300px] w-full" /> : <ProductionOutputChart />}
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <AIChat />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}