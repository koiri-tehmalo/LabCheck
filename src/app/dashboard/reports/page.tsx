'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Lock } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { EquipmentItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { useAuth } from '@/hooks/use-auth';
import { getEquipmentItems } from '@/actions/equipment';
import { getSetOptions } from '@/actions/set';
import { hasPermission } from '@/lib/permissions';

export default function ReportsPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [setOptionsList, setSetOptionsList] = useState<{ id: string; name: string }[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setDataLoading(true);
      const [items, sets] = await Promise.all([
        getEquipmentItems(),
        getSetOptions(),
      ]);
      setEquipment(items);
      setSetOptionsList(sets);
      setDataLoading(false);
    }

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const handleExport = () => {
    if (equipment.length === 0) return;

    const setMap = new Map(setOptionsList.map(set => [set.id, set.name]));

    const dataToExport = equipment.map(item => ({
      'หมายเลขครุภัณฑ์': item.assetId,
      'ชื่อ': item.name,
      'รุ่น': item.model,
      'สถานะ': item.status,
      'สถานที่': item.location,
      'วันที่จัดซื้อ': new Date(item.purchaseDate).toLocaleDateString('th-TH'),
      'ชุดครุภัณฑ์': item.setId ? setMap.get(item.setId) || 'N/A' : 'N/A',
      'หมายเหตุ': item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานครุภัณฑ์");

    const columnWidths = [
      { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 10 },
      { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 40 },
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, "รายงานครุภัณฑ์.xlsx");
  };

  const loading = authLoading || dataLoading;

  if (loading) {
     return (
        <div className="space-y-4 md:space-y-8">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">รายงาน</h1>
        <p className="text-muted-foreground">สร้างและดูรายงานครุภัณฑ์</p>
      </div>

      <div className="glass-card overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className='flex items-center gap-3'>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(230,80%,62%,0.15)]">
                <FileText className="h-6 w-6 text-[hsl(230,80%,70%)]" />
              </div>
              <div>
                <CardTitle>รายงานครุภัณฑ์</CardTitle>
                <CardDescription>ส่งออกรายการครุภัณฑ์ทั้งหมดเป็นไฟล์ Excel</CardDescription>
              </div>
            </div>
            { hasPermission(user?.role, 'VIEW_REPORTS') ? (
                <Button onClick={handleExport} disabled={equipment.length === 0} className="w-full md:w-auto btn-gradient border-0">
                  <Download className="mr-2 h-4 w-4" />
                  ส่งออกเป็น Excel
                </Button>
            ) : (
                 <Button disabled className="w-full md:w-auto">
                    <Lock className="mr-2 h-4 w-4" />
                    เข้าสู่ระบบเพื่อส่งออก
                 </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            { hasPermission(user?.role, 'VIEW_REPORTS') ? 
              'คลิกปุ่มด้านบนเพื่อดาวน์โหลดรายงานครุภัณฑ์เป็นไฟล์ .xlsx' :
              'บัญชีผู้ใช้นี้ไม่มีสิทธิ์ส่งออกรายงาน'
            }
          </p>
        </CardContent>
      </div>

      <div className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle>ตัวอย่างข้อมูลครุภัณฑ์</CardTitle>
          <CardDescription>แสดง 10 รายการล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/30 hover:bg-transparent">
                            <TableHead>หมายเลขครุภัณฑ์</TableHead>
                            <TableHead>ชื่อ</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead className="hidden md:table-cell">สถานที่</TableHead>
                            <TableHead className="hidden sm:table-cell">วันที่จัดซื้อ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {equipment.slice(0, 10).map((item) => (
                            <TableRow key={item.id} className="border-border/30 glass-row">
                                <TableCell className="font-medium">{item.assetId}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell><StatusBadge status={item.status} /></TableCell>
                                <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                                <TableCell className="hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString('th-TH')}</TableCell>
                            </TableRow>
                        ))}
                         {equipment.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    ไม่พบข้อมูลครุภัณฑ์
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </div>
    </div>
  );
}
