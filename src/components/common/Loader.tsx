const Loader: React.FC = () => {
    const [scale, setScale] = useState(0.8);
    const [opacity, setOpacity] = useState(0);
    const [rotation, setRotation] = useState(0);
    useEffect(() => {
        const scaleAnimation = setInterval(() => {
            setScale((prev) => (prev === 0.8 ? 1.1 : 0.8));
        }, 750);
        const opacityAnimation = setTimeout(() => {
            setOpacity(1);
        }, 500);
        const rotationAnimation = setInterval(() => {
            setRotation((prev) => prev + 360);
        }, 1500);
        return () => {
            clearInterval(scaleAnimation);
            clearTimeout(opacityAnimation);
            clearInterval(rotationAnimation);
        };
    }, [0]);
    return (<div className='fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70'>
      <div style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            opacity: opacity,
            transition: 'transform 0.75s ease-in-out, opacity 0.5s ease-in-out'
        }} className='w-16 h-16 border-4 border-primary-500 border-t-primary-200 rounded-full'/>
      <span style={{
            opacity: opacity,
            transition: 'opacity 0.5s ease-in-out',
            transitionDelay: '0.5s'
        }} className='absolute text-sm text-gray-600 dark:text-gray-300 mt-24'>
        Loading...
      </span>
    </div>);
};
export type  = default;
Loader;
import type { GlobalTypes } from '@/types/global';
import React, { useEffect, useState } from 'react';
