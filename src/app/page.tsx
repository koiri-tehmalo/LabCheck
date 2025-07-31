
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, TriangleAlert, CircleCheckBig, CircleHelp, Plus, Camera, FileText, Component, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Progress } from "@/components/ui/progress";
import { getDashboardStats, getRecentActivity, getUser } from "@/lib/actions";
import type { EquipmentItem, User } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type DashboardStats = {
  total: number;
  usable: number;
  broken: number;
  lost: number;
  error?: string | null;
}

export default async function DashboardPage() {
  const statsPromise = getDashboardStats();
  const recentActivityPromise = getRecentActivity();
  const userPromise = getUser();

  const [stats, recentActivity, user] = await Promise.all([
    statsPromise,
    recentActivityPromise,
    userPromise
  ]);
  
  const { total, usable, broken, lost } = stats;

  const statsForChart = [
    { label: 'Usable', count: usable, color: 'bg-green-500' },
    { label: 'Broken', count: broken, color: 'bg-orange-500' },
    { label: 'Lost', count: lost, color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {user?.name ?? '...'}!</h2>
            <p className="opacity-80">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="p-3 bg-primary-foreground/20 rounded-lg">
            <HardDrive className="h-8 w-8 text-white" />
          </div>
        </CardContent>
      </Card>
      
      {stats.error && (
         <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Database Error</AlertTitle>
          <AlertDescription>
            {stats.error} Stats and recent activity may not be accurate.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards in a Table */}
      <Card>
          <CardHeader>
              <CardTitle>Asset Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-secondary">
                          <tr>
                              <th scope="col" className="px-6 py-3">สถานะ</th>
                              <th scope="col" className="px-6 py-3">จำนวน</th>
                              <th scope="col" className="px-6 py-3">คำอธิบาย</th>
                              <th scope="col" className="px-6 py-3 text-center">สัญลักษณ์</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="border-b">
                              <td className="px-6 py-4 font-medium">Total Assets</td>
                              <td className="px-6 py-4">{total}</td>
                              <td className="px-6 py-4 text-muted-foreground">All items in inventory</td>
                              <td className="px-6 py-4 flex justify-center"><HardDrive className="h-5 w-5"/></td>
                          </tr>
                          <tr className="border-b bg-green-500/10">
                              <td className="px-6 py-4 font-medium">Usable Assets</td>
                              <td className="px-6 py-4">{usable}</td>
                              <td className="px-6 py-4 text-muted-foreground">Items ready for use</td>
                              <td className="px-6 py-4 flex justify-center"><CircleCheckBig className="h-5 w-5 text-green-600"/></td>
                          </tr>
                          <tr className="border-b bg-orange-500/10">
                              <td className="px-6 py-4 font-medium">Broken Assets</td>
                              <td className="px-6 py-4">{broken}</td>
                              <td className="px-6 py-4 text-muted-foreground">Items needing repair</td>
                              <td className="px-6 py-4 flex justify-center"><TriangleAlert className="h-5 w-5 text-orange-600"/></td>
                          </tr>
                          <tr className="bg-red-500/10">
                              <td className="px-6 py-4 font-medium">Lost Assets</td>
                              <td className="px-6 py-4">{lost}</td>
                              <td className="px-6 py-4 text-muted-foreground">Missing items</td>
                              <td className="px-6 py-4 flex justify-center"><CircleHelp className="h-5 w-5 text-red-600"/></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex-col h-24" asChild>
            <Link href="/dashboard/equipment">
              <Plus className="h-6 w-6 mb-1" />
              <span>Add Asset</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex-col h-24" asChild>
            <Link href="/dashboard/equipment">
              <Camera className="h-6 w-6 mb-1" />
              <span>Scan Equipment</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex-col h-24" asChild>
            <Link href="/dashboard/reports">
              <FileText className="h-6 w-6 mb-1" />
              <span>Generate Report</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex-col h-24" asChild>
            <Link href="/dashboard/sets">
              <Component className="h-6 w-6 mb-1" />
              <span>Equipment Sets</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {/* Recent Activity */}
        <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                 <Button variant="link" asChild>
                    <Link href="/dashboard/equipment">View all →</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-muted-foreground uppercase">
                           <tr>
                               <th className="pb-2">Asset Name</th>
                               <th className="pb-2">Date Added</th>
                               <th className="pb-2 text-right">Status</th>
                           </tr>
                        </thead>
                        <tbody>
                            {recentActivity.length > 0 ? (
                                recentActivity.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="py-2">
                                            <Link href={`/dashboard/equipment/${item.id}`} className="font-medium hover:underline">
                                                {item.name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">{item.id}</div>
                                        </td>
                                        <td className="py-2">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                                        <td className="py-2 text-right"><StatusBadge status={item.status} /></td>
                                    </tr>
                                ))
                             ) : (
                                <tr>
                                    <td colSpan={3} className="py-4 text-center text-muted-foreground">
                                        No recent activity or could not load data.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

        {/* Status Overview Chart */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsForChart.map(({ label, count, color }) => {
                const percent = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <div className="flex items-center gap-2">
                         <span className={`h-2 w-2 rounded-full ${color}`} />
                         <span className="font-medium">{label}</span>
                      </div>
                      <span className="text-muted-foreground">{count} ({percent.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percent} className="h-2 [&>div]:bg-primary" />
                  </div>
                );
              })}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
