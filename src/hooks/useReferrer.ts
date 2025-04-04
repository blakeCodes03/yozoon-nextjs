// src/hooks/useReferrer.ts

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const useReferrer = () => {
  const router = useRouter();
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    const { ref } = router.query;

    if (ref && typeof ref === 'string') {
      setReferrer(ref);
      Cookies.set('referrer', ref, { expires: 7 }); // Expires in 7 days
    } else {
      const cookieReferrer = Cookies.get('referrer');
      if (cookieReferrer) {
        setReferrer(cookieReferrer);
      }
    }
  }, [router.query]);

  return referrer;
};
