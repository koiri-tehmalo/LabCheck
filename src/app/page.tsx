'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, TriangleAlert, CircleCheckBig, CircleHelp, Plus, Camera, FileText, Component } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Progress } from "@/components/ui/progress";
import type { EquipmentItem, DashboardStats } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { getDashboardStats, getRecentActivity } from '@/actions/dashboard';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ total: 0, usable: 0, broken: 0, lost: 0 });
  const [recentActivity, setRecentActivity] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(5),
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
      setLoading(false);
    }

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const { total, usable, broken, lost } = stats;

  const statsForChart = [
    { label: 'ใช้งานได้', count: usable, color: 'from-emerald-500 to-emerald-400', glow: 'shadow-emerald-500/20' },
    { label: 'ชำรุด', count: broken, color: 'from-amber-500 to-orange-400', glow: 'shadow-amber-500/20' },
    { label: 'สูญหาย', count: lost, color: 'from-rose-500 to-red-400', glow: 'shadow-rose-500/20' },
  ];

  const welcomeName = user ? user.name : 'ผู้เยี่ยมชม';

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {/* Welcome Section — Gradient Glass */}
      <div className="glass-elevated p-5 md:p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            สวัสดี, {welcomeName}!
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            {new Date().toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-[hsl(230,80%,55%)] to-[hsl(260,70%,55%)] rounded-xl shadow-lg shadow-[hsl(230,80%,55%,0.3)]">
          <HardDrive className="h-6 w-6 md:h-7 md:w-7 text-white" />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 group hover:border-[hsl(230,80%,62%,0.3)] transition-glass">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[hsl(230,80%,62%,0.15)]">
              <HardDrive className="h-4 w-4 text-[hsl(230,80%,70%)]" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">ทั้งหมด</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{total}</p>
        </div>
        <div className="glass-card p-4 group hover:border-emerald-500/30 transition-glass">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/15">
              <CircleCheckBig className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">ใช้งานได้</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{usable}</p>
        </div>
        <div className="glass-card p-4 group hover:border-amber-500/30 transition-glass">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/15">
              <TriangleAlert className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">ชำรุด</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{broken}</p>
        </div>
        <div className="glass-card p-4 group hover:border-rose-500/30 transition-glass">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-rose-500/15">
              <CircleHelp className="h-4 w-4 text-rose-400" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">สูญหาย</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{lost}</p>
        </div>
      </div>

      {/* Quick Actions */}
       { user && (
        <div className="glass-card p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">ทางลัด</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/dashboard/equipment" className="btn-glass flex flex-col items-center justify-center h-20 gap-2 text-center hover:border-[hsl(230,80%,62%,0.4)] hover:shadow-lg hover:shadow-[hsl(230,80%,62%,0.1)]">
                <Plus className="h-5 w-5 text-[hsl(230,80%,70%)]" />
                <span className="text-xs">เพิ่มครุภัณฑ์</span>
              </Link>
              <Link href="/dashboard/equipment" className="btn-glass flex flex-col items-center justify-center h-20 gap-2 text-center hover:border-[hsl(260,70%,60%,0.4)] hover:shadow-lg hover:shadow-[hsl(260,70%,55%,0.1)]">
                <Camera className="h-5 w-5 text-[hsl(260,70%,70%)]" />
                <span className="text-xs">สแกนครุภัณฑ์</span>
              </Link>
              <Link href="/dashboard/reports" className="btn-glass flex flex-col items-center justify-center h-20 gap-2 text-center hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
                <FileText className="h-5 w-5 text-emerald-400" />
                <span className="text-xs">สร้างรายงาน</span>
              </Link>
              <Link href="/dashboard/sets" className="btn-glass flex flex-col items-center justify-center h-20 gap-2 text-center hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
                <Component className="h-5 w-5 text-amber-400" />
                <span className="text-xs">ชุดครุภัณฑ์</span>
              </Link>
            </div>
        </div>
       )}

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Recent Activity */}
        <div className="glass-card lg:col-span-3 overflow-hidden">
            <div className="flex items-center justify-between p-5 pb-0">
                <h3 className="text-base font-semibold text-foreground">กิจกรรมล่าสุด</h3>
                <Link href="/dashboard/equipment" className="text-sm text-[hsl(230,80%,70%)] hover:text-[hsl(230,80%,80%)] transition-colors">
                  ดูทั้งหมด →
                </Link>
            </div>
            <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground uppercase tracking-wider">
                       <tr>
                           <th className="pb-3 text-left font-medium">ชื่อครุภัณฑ์</th>
                           <th className="pb-3 text-left hidden sm:table-cell font-medium">วันที่เพิ่ม</th>
                           <th className="pb-3 text-right font-medium">สถานะ</th>
                       </tr>
                    </thead>
                    <tbody>
                        {recentActivity.length > 0 ? (
                            recentActivity.map(item => (
                                <tr key={item.id} className="border-t border-border/30 glass-row">
                                    <td className="py-3">
                                        <Link href={`/dashboard/equipment/${item.id}`} className="font-medium text-foreground hover:text-[hsl(230,80%,70%)] transition-colors">
                                            {item.name}
                                        </Link>
                                        <div className="text-xs text-muted-foreground mt-0.5">{item.assetId}</div>
                                    </td>
                                    <td className="py-3 text-muted-foreground hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString('th-TH')}</td>
                                    <td className="py-3 text-right"><StatusBadge status={item.status} /></td>
                                </tr>
                            ))
                         ) : (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                                    ไม่มีกิจกรรมล่าสุด
                                </td>
                            </tr>
                         )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Status Overview Chart */}
        <div className="glass-card lg:col-span-2 p-5">
            <h3 className="text-base font-semibold text-foreground mb-5">ภาพรวม</h3>
            <div className="space-y-5">
              {statsForChart.map(({ label, count, color, glow }) => {
                const percent = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="font-medium text-foreground/80">{label}</span>
                      <span className="text-muted-foreground text-xs">{count} ({percent.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-[hsl(220,15%,12%)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color} shadow-lg ${glow} transition-all duration-700`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    </div>
  );
}
