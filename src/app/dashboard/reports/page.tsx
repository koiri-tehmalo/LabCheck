
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ServerCrash, Lock } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { EquipmentItem } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const fromSnapshotToEquipmentItem = (snapshot: any): EquipmentItem => {
    const data = snapshot.data();
    return {
        id: snapshot.id,
        ...data,
        purchaseDate: data.purchaseDate.toDate().toISOString(),
    } as EquipmentItem;
};


export default function ReportsPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [setOptions, setSetOptions] = useState<{ id: string; name: string }[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getEquipmentItems() {
        const q = query(collection(db, "equipment"), orderBy("purchaseDate", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(fromSnapshotToEquipmentItem);
    }
    
    async function getSetOptions() {
        const setsCollection = collection(db, "equipment_sets");
        const q = query(setsCollection, orderBy("name"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string }));
    }

    async function fetchData() {
      setDataLoading(true);
      try {
        const itemsPromise = getEquipmentItems();
        const setsPromise = getSetOptions();
        const [items, sets] = await Promise.all([itemsPromise, setsPromise]);
        setEquipment(items);
        setSetOptions(sets);
      } catch (e: any) {
        if (e.code === 'permission-denied') {
          setError('Public access denied. Please update Firestore security rules to allow reads.');
        } else {
          setError('Failed to load data.');
        }
        console.error(e);
      } finally {
        setDataLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const handleExport = () => {
    if (equipment.length === 0) return;

    const setMap = new Map(setOptions.map(set => [set.id, set.name]));

    const dataToExport = equipment.map(item => ({
      'หมายเลขครุภัณฑ์': item.assetId,
      'Name': item.name,
      'Model': item.model,
      'Status': item.status,
      'Location': item.location,
      'Purchase Date': new Date(item.purchaseDate).toLocaleDateString(),
      'Equipment Set': item.setId ? setMap.get(item.setId) || 'N/A' : 'N/A',
      'Notes': item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment Report");

    const columnWidths = [
      { wch: 20 }, // หมายเลขครุภัณฑ์
      { wch: 25 }, // Name
      { wch: 20 }, // Model
      { wch: 10 }, // Status
      { wch: 20 }, // Location
      { wch: 15 }, // Purchase Date
      { wch: 20 }, // Equipment Set
      { wch: 40 }, // Notes
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, "Equipment_Report.xlsx");
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view equipment reports.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className='flex items-center gap-3'>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>Export a complete list of all equipment assets.</CardDescription>
              </div>
            </div>
            { user ? (
                <Button onClick={handleExport} disabled={equipment.length === 0 || loading} className="w-full md:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
            ) : (
                 <Button disabled  className="w-full md:w-auto">
                    <Lock className="mr-2 h-4 w-4" />
                    Login to Export
                 </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <ServerCrash className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!error && (
            <p className="text-sm text-muted-foreground">
              { user ? 
                'Click the button above to download the full equipment inventory report as an .xlsx file.' :
                'Please sign in to export the inventory report.'
              }
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Equipment Data Preview</CardTitle>
          <CardDescription>Showing the 10 most recently added items.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-lg border">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>หมายเลขครุภัณฑ์</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Location</TableHead>
                            <TableHead className="hidden sm:table-cell">Purchase Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && Array.from({ length: 5 }).map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-[90px]" /></TableCell>
                             </TableRow>
                        ))}
                        {!loading && equipment.slice(0, 10).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.assetId}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell><StatusBadge status={item.status} /></TableCell>
                                <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                                <TableCell className="hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                         {!loading && equipment.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No equipment found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
