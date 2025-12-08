import React, { Suspense } from 'react';

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </section>
  );
}
