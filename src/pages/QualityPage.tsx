import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Percent } from "lucide-react";
import { DefectTrendChart } from "@/components/charts/DefectTrendChart";
import { DefectsDataTable } from "@/components/DefectsDataTable";
import useProductionDataStore from "@/hooks/use-production-data";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export function QualityPage() {
  const { defects, isLoading, fetchData } = useProductionDataStore();
  useEffect(() => {
    if (defects.length === 0) {
      fetchData();
    }
  }, [fetchData, defects.length]);
  const kpiData = [
    { title: "First Pass Yield", value: "98.2%", icon: Percent },
    { title: "Defects Per Million", value: "1,240", icon: AlertCircle },
    { title: "Products Scanned", value: "15,782", icon: CheckCircle },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Real-Time Quality Analysis</h1>
        <p className="text-muted-foreground">Monitor product quality and track defect trends across your production line.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{kpi.value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Defect Trends</CardTitle>
          <CardDescription>Monthly defect counts by type.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-[300px] w-full" /> : <DefectTrendChart />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Quality Issues</CardTitle>
          <CardDescription>A log of the most recent defects identified by the AI.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-[200px] w-full" /> : <DefectsDataTable defects={defects} />}
        </CardContent>
      </Card>
    </div>
  );
}