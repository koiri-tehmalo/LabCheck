
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEquipmentItems, mockUser } from "@/data/mock-data";
import { HardDrive, AlertTriangle, CheckCircle, HelpCircle, Plus, Camera, FileText, Component } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const total = mockEquipmentItems.length;
  const usable = mockEquipmentItems.filter(item => item.status === 'usable').length;
  const broken = mockEquipmentItems.filter(item => item.status === 'broken').length;
  const lost = mockEquipmentItems.filter(item => item.status === 'lost').length;

  const stats = [
    { label: 'Usable', count: usable, color: 'bg-green-500', icon: <CheckCircle className="text-green-500" /> },
    { label: 'Broken', count: broken, color: 'bg-orange-500', icon: <AlertTriangle className="text-orange-500" /> },
    { label: 'Lost', count: lost, color: 'bg-red-500', icon: <HelpCircle className="text-red-500" /> },
  ];

  const recentActivity = mockEquipmentItems.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {mockUser.name}!</h2>
            <p className="opacity-80">
              Today is {new Date().toLocaleDateString('en-US', {
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
                              <th scope="col" className="px-6 py-3">Status</th>
                              <th scope="col" className="px-6 py-3">Count</th>
                              <th scope="col" className="px-6 py-3">Description</th>
                              <th scope="col" className="px-6 py-3 text-center">Icon</th>
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
                              <td className="px-6 py-4 flex justify-center"><CheckCircle className="h-5 w-5 text-green-600"/></td>
                          </tr>
                          <tr className="border-b bg-orange-500/10">
                              <td className="px-6 py-4 font-medium">Broken Assets</td>
                              <td className="px-6 py-4">{broken}</td>
                              <td className="px-6 py-4 text-muted-foreground">Items needing repair</td>
                              <td className="px-6 py-4 flex justify-center"><AlertTriangle className="h-5 w-5 text-orange-600"/></td>
                          </tr>
                          <tr className="bg-red-500/10">
                              <td className="px-6 py-4 font-medium">Lost Assets</td>
                              <td className="px-6 py-4">{lost}</td>
                              <td className="px-6 py-4 text-muted-foreground">Missing items</td>
                              <td className="px-6 py-4 flex justify-center"><HelpCircle className="h-5 w-5 text-red-600"/></td>
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
                            {recentActivity.map(item => (
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
                            ))}
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
              {stats.map(({ label, count, color, icon }) => {
                const percent = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <div className="flex items-center gap-2">
                         <span className="h-2 w-2 rounded-full ${color}" />
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
