'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import type { EquipmentItem } from '@/lib/types';
import { ReportStatusClient } from './report-status-client';
import { useAuth } from '@/hooks/use-auth';
import { getSetOptions } from '@/actions/set';
import { logger } from '@/lib/logger';
import { hasPermission } from '@/lib/permissions';

async function generateQRCode(text: string) {
    try {
        const url = await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.9,
            margin: 1,
        } as any);
        return url;
    } catch (err) {
        logger.error('Failed to generate QR code:', err);
        return null;
    }
}

function PrintAndDownloadButtons({ qrCodeDataUrl, itemId }: { qrCodeDataUrl: string | null; itemId: string }) {
    const handleDownload = () => {
        if (!qrCodeDataUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeDataUrl;
        link.download = `${itemId}_qrcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex gap-2 w-full print:hidden">
            <Button variant="outline" className="w-full btn-glass border-border/40" onClick={handleDownload} disabled={!qrCodeDataUrl}>
                <Download className="mr-2 h-4 w-4" /> PNG
            </Button>
            <Button variant="outline" className="w-full btn-glass border-border/40" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> พิมพ์
            </Button>
        </div>
    );
}

export function EquipmentDetailClient({ item: initialItem }: { item: EquipmentItem }) {
  const [item, setItem] = useState(initialItem);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [setName, setSetName] = useState<string | null>(null);
  const [loadingSet, setLoadingSet] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    const assetUrl = `${window.location.origin}/dashboard/equipment/${item.id}`;
    generateQRCode(assetUrl).then((url) => {
        if (url) setQrCodeDataUrl(url);
    });

    async function fetchSetName() {
      if (!item.setId) {
        setLoadingSet(false);
        return;
      }
      const sets = await getSetOptions();
      const found = sets.find(s => s.id === item.setId);
      setSetName(found ? found.name : 'ไม่พบชุดครุภัณฑ์');
      setLoadingSet(false);
    }

    fetchSetName();
  }, [item.id, item.setId]);
  
  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-4 printable-area">
       <div className="print:hidden">
        <Button variant="outline" asChild className="btn-glass border-border/40">
            <Link href="/dashboard/equipment">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปรายการครุภัณฑ์
            </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:gap-8 md:grid-cols-3 print:grid-cols-1">
        <div className="md:col-span-2 space-y-4 md:space-y-8 print:col-span-1">
            <Card className="glass-card border-border/40 print:shadow-none print:border-none">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl md:text-2xl print:text-xl">{item.name}</CardTitle>
                            <CardDescription>{item.model}</CardDescription>
                        </div>
                        <StatusBadge status={item.status} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">หมายเลขครุภัณฑ์</p>
                            <p>{item.assetId}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">สถานที่</p>
                            <p>{item.location}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">วันที่จัดซื้อ</p>
                            <p>{new Date(item.purchaseDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        {item.setId && (
                            <div>
                                <p className="font-medium text-muted-foreground">ชุดครุภัณฑ์</p>
                                <p>{loadingSet ? '...' : setName}</p>
                            </div>
                        )}
                    </div>
                    {item.notes && (
                         <div className="mt-6">
                            <p className="font-medium text-muted-foreground">หมายเหตุ</p>
                            <p className="text-sm mt-1 p-3 bg-[hsl(220,15%,12%)] rounded-lg border border-border/30">{item.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {hasPermission(user?.role, 'UPDATE_EQUIPMENT') && <ReportStatusClient item={item} setItem={setItem} />}
        </div>
        <div className="space-y-4 print:col-span-1 print:flex print:flex-col print:items-center">
             <Card className="glass-card border-border/40 print:shadow-none print:border-none">
                <CardHeader className="print:text-center">
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription className="print:hidden">สแกนเพื่อดูรายละเอียดครุภัณฑ์นี้</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {qrCodeDataUrl ? (
                        <div className="p-4 bg-white rounded-xl">
                            <Image 
                                src={qrCodeDataUrl}
                                alt={`QR code สำหรับ ${item.name}`}
                                width={200}
                                height={200}
                            />
                        </div>
                    ) : (
                        <div className="h-[234px] w-[234px] flex items-center justify-center p-4 text-destructive-foreground bg-destructive rounded-md text-sm">
                            ไม่สามารถสร้าง QR code ได้
                        </div>
                    )}
                   <PrintAndDownloadButtons qrCodeDataUrl={qrCodeDataUrl} itemId={item.id} />
                </CardContent>
            </Card>
        </div>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
