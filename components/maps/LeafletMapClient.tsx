'use client';

import dynamic from 'next/dynamic';

const BayAreaMap = dynamic(() => import('@/components/maps/BayAreaMap'), { ssr: false });

export default function LeafletMapClient() {
  return <BayAreaMap />;
}
