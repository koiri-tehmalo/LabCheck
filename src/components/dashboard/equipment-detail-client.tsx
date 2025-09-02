
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
import type { EquipmentItem } from '@/lib/types';
import { ReportStatusClient } from './report-status-client';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

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

// A client component to handle print and download which need browser APIs
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
            <Button variant="outline" className="w-full" onClick={handleDownload} disabled={!qrCodeDataUrl}>
                <Download className="mr-2 h-4 w-4" /> PNG
            </Button>
            <Button variant="outline" className="w-full" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
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
    // We can't know the full URL on the server, so we generate a relative one
    // and the QR code will point to that.
    const assetUrl = `${window.location.origin}/dashboard/equipment/${item.id}`;
    generateQRCode(assetUrl).then(setQrCodeDataUrl);

    async function fetchSetName() {
      if (!item.setId) {
        setLoadingSet(false);
        return;
      }
      try {
        const setDocRef = doc(db, 'equipment_sets', item.setId);
        const setDocSnap = await getDoc(setDocRef);
        if (setDocSnap.exists()) {
          setSetName(setDocSnap.data().name);
        } else {
          setSetName('Unknown Set');
        }
      } catch (error) {
        console.error("Error fetching set name: ", error);
        setSetName('Error');
      } finally {
        setLoadingSet(false);
      }
    }

    fetchSetName();
  }, [item.id, item.setId]);
  
  return (
    <div className="flex flex-col gap-4 md:gap-8 print:gap-4 printable-area">
       <div className="print:hidden">
        <Button variant="outline" asChild>
            <Link href="/dashboard/equipment">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Equipment List
            </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:gap-8 md:grid-cols-3 print:grid-cols-1">
        <div className="md:col-span-2 space-y-4 md:space-y-8 print:col-span-1">
            <Card className="print:shadow-none print:border-none">
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
                            <p className="font-medium text-muted-foreground">Location</p>
                            <p>{item.location}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">Purchase Date</p>
                            <p>{new Date(item.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        {item.setId && (
                            <div>
                                <p className="font-medium text-muted-foreground">Equipment Set</p>
                                {loadingSet ? (
                                  <Skeleton className="h-5 w-24 mt-1" />
                                ) : (
                                  <p>{setName}</p>
                                )}
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
            {user && <ReportStatusClient item={item} setItem={setItem} />}
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
