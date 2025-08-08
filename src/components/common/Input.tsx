// src/components/common/Input.tsx

import React from 'react';
import Tooltip from './Tooltip';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
  reacticon?: string;
  classname?: string;
}

const Input: React.FC<InputProps> = ({ label, tooltip, ...props }) => {
  return (
    <div className="mb-4 relative group">
      <label
        htmlFor={props.name}
        className="block text-white font-[700] text-sm sm:text-[18px] inter-fonts"
      >
        {label} {tooltip && <Tooltip message={tooltip} />}
      </label>
      <div className="relative">
        <input
          {...props}
          id={props.name}
          placeholder={props.placeholder}
          className={cn(
            'bg-inherit w-full text-white pr-8 py-2 focus:outline-none border-b-[1px] placeholder:text-[12px] placeholder:text-gray-600 ',
            props.className
          )}
        />

        <i
          className={cn(
            'fas  absolute right-0 top-3 text-[#B2B2B2]',
            props.reacticon
          )}
        ></i>
      </div>
    </div>
  );
};

export default Input;
