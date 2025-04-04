// src/components/layout/Sidebar.tsx

import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Home
        </Link>
        <Link href="/dashboard/coins" className="hover:bg-gray-700 p-2 rounded">
          Coins
        </Link>
        <Link href="/dashboard/settings" className="hover:bg-gray-700 p-2 rounded">
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
