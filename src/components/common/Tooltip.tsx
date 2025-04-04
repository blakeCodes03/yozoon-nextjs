// src/components/common/Tooltip.tsx

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface TooltipProps {
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  return (
    <div className="relative inline-block group">
      <FaInfoCircle className="inline text-[#9CA3AF] ml-1 cursor-pointer" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#3C3D3E] text-[#E8E8E9] text-sm rounded py-1 px-2 whitespace-no-wrap">
        {message}
      </div>
    </div>
  );
};

export default Tooltip;
