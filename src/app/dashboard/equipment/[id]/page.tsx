import { mockEquipmentItems } from '@/data/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';

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

export default async function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const item = mockEquipmentItems.find(i => i.id === params.id);

  if (!item) {
    notFound();
  }

  // In a real app, you'd get the full URL from the request or environment variables.
  const assetUrl = `http://localhost:9002/dashboard/equipment/${item.id}`;
  const qrCodeDataUrl = await generateQRCode(assetUrl);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="outline" asChild>
            <Link href="/dashboard/equipment">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Equipment List
            </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{item.name}</CardTitle>
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
        <div className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>Scan to view this asset's details.</CardDescription>
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
                        <div className="p-4 text-destructive-foreground bg-destructive rounded-md text-sm">
                            Could not generate QR code.
                        </div>
                    )}
                    <div className="flex gap-2 w-full">
                         <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" /> PNG
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
