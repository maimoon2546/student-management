'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AuthGuard() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const staff = localStorage.getItem('staff');

    if (!staff) {
      router.push(`${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/scan/${params.student_code}`);
    }
  }, [router, params]);

  return null;
}