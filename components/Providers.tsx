'use client';

import { CameraProvider } from '@/lib/CameraContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return <CameraProvider>{children}</CameraProvider>;
}
