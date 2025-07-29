'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { mockEquipmentItems } from '@/data/mock-data';
import * as XLSX from 'xlsx';
import type { EquipmentItem } from '@/lib/types';

export default function ReportsPage() {

  const handleExport = () => {
    const dataToExport = mockEquipmentItems.map(item => ({
        'Asset ID': item.id,
        'Name': item.name,
        'Model': item.model,
        'Status': item.status,
        'Location': item.location,
        'Purchase Date': new Date(item.purchaseDate).toLocaleDateString(),
        'Set ID': item.setId || 'N/A',
        'Notes': item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment Report");

    // Adjust column widths
    const columnWidths = [
        { wch: 15 }, // Asset ID
        { wch: 25 }, // Name
        { wch: 20 }, // Model
        { wch: 10 }, // Status
        { wch: 20 }, // Location
        { wch: 15 }, // Purchase Date
        { wch: 10 }, // Set ID
        { wch: 40 }, // Notes
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, "Equipment_Report.xlsx");
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view equipment reports.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-3'>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                  <CardTitle>Inventory Report</CardTitle>
                  <CardDescription>Export a complete list of all equipment assets.</CardDescription>
              </div>
            </div>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the button above to download the full equipment inventory report as an .xlsx file. 
            This file can be opened with Microsoft Excel, Google Sheets, or other spreadsheet software.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
