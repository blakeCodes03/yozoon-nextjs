'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useEffect, useState } from 'react';

export function ToggleTheme() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => setMounted(true));

  return (
    <div>
      { mounted && resolvedTheme === 'dark' ? (
        <Sun
          className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all text-white dark:scale-100 dark:rotate-0"
          onClick={() => setTheme('light')}
        />
      ) : (
        <Moon
          className=" h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-black transition-all dark:scale-0 dark:-rotate-90"
          onClick={() => setTheme('dark')}
        />
      )}
    </div>
  );
}
