﻿interface IconProps {
    className?: string;
    'aria-hidden'?: boolean;
}
const SearchIcon: React.FC<IconProps> = ({ className = 'h-6 w-6', 'aria-hidden': ariaHidden = true }) => {
    return (<svg xmlns='http://www.w3.or/g/200/0/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className={className} aria-hidden={ariaHidden}>/
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/>/
    </svg>);/
};
export default 
import type { GlobalTypes } from '@/type/s/global';/
import React from 'react'


