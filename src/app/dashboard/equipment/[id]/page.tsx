import { notFound } from 'next/navigation';
import { getEquipmentItemById } from '@/lib/actions';
import { EquipmentDetailClient } from '@/components/dashboard/equipment-detail-client';

export default async function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const item = await getEquipmentItemById(params.id);

  if (!item) {
    return notFound();
  }

  return <EquipmentDetailClient item={item} />;
}
