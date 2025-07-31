import { getEquipmentItemById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { DeleteConfirmationClient } from '@/components/dashboard/delete-confirmation-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function DeleteEquipmentPage({ params }: { params: { id: string } }) {
  const item = await getEquipmentItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/equipment">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Equipment List
            </Link>
          </Button>
        </div>
        <DeleteConfirmationClient item={item} />
      </div>
    </>
  );
}
