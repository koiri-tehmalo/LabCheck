
'use client';

import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { getEquipmentItemById } from '@/lib/actions';
import type { EquipmentItem } from '@/lib/types';

async function generateQRCode(text: string) {
    try {
        const url = await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.9,
            margin: 1,
        });
        return url;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const fetchedItem = await getEquipmentItemById(params.id);
      if (!fetchedItem) {
        notFound();
      } else {
        setItem(fetchedItem);
        const assetUrl = `${window.location.origin}/dashboard/equipment/${fetchedItem.id}`;
        generateQRCode(assetUrl).then(setQrCodeDataUrl);
      }
      setLoading(false);
    }
    fetchItem();
  }, [params.id]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return notFound();
  }
  
  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${item.id}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="flex flex-col gap-8 print:gap-4">
       <div className="print:hidden">
        <Button variant="outline" asChild>
            <Link href="/dashboard/equipment">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Equipment List
            </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3 print:grid-cols-1">
        <div className="md:col-span-2 space-y-8 print:col-span-1">
            <Card className="print:shadow-none print:border-none">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl print:text-xl">{item.name}</CardTitle>
                            <CardDescription>{item.model}</CardDescription>
                        </div>
                        <StatusBadge status={item.status} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">Asset ID</p>
                            <p>{item.id}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">Location</p>
                            <p>{item.location}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">Purchase Date</p>
                            <p>{new Date(item.purchaseDate).toLocaleDateString()}</p>
                        </div>
                        {item.setId && (
                            <div>
                                <p className="font-medium text-muted-foreground">Equipment Set</p>
                                <p>{item.setId}</p>
                            </div>
                        )}
                    </div>
                    {item.notes && (
                         <div className="mt-6">
                            <p className="font-medium text-muted-foreground">Notes</p>
                            <p className="text-sm mt-1 p-3 bg-secondary rounded-md">{item.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4 print:col-span-1 print:flex print:flex-col print:items-center">
             <Card className="print:shadow-none print:border-none">
                <CardHeader className="print:text-center">
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription className="print:hidden">Scan to view this asset's details.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {qrCodeDataUrl ? (
                        <div className="p-4 bg-white rounded-lg border">
                            <Image 
                                src={qrCodeDataUrl}
                                alt={`QR code for ${item.name}`}
                                width={200}
                                height={200}
                            />
                        </div>
                    ) : (
                        <div className="h-[234px] w-[234px] flex items-center justify-center p-4 text-destructive-foreground bg-destructive rounded-md text-sm">
                            Could not generate QR code.
                        </div>
                    )}
                    <div className="flex gap-2 w-full print:hidden">
                         <Button variant="outline" className="w-full" onClick={handleDownload} disabled={!qrCodeDataUrl}>
                            <Download className="mr-2 h-4 w-4" /> PNG
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
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
