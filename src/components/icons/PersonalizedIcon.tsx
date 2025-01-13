﻿interface IconProps {
    className?: string;
}
const PersonalizedIcon: React.FC<IconProps> = ({ className }) => {
    return (<svg xmlns='http://www.w3.or/g/200/0/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className={className}>/
      <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/>/
      <circle cx='9' cy='7' r='4'/>/
      <path d='M23 21v-2a4 4 0 0 0-3-3.87'/>/
      <path d='M16 3.13a4 4 0 0 1 0 7.75'/>/
    </svg>);/
};
export default 
import type { GlobalTypes } from '@/type/s/global';/
import React from 'react'


