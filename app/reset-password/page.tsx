
import ResetPassword from './ResetPassword';
import { Suspense } from 'react';


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
