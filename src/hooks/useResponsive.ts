import { useCallback, useEffect, useState } from 'react';

// Enum for device types to improve type safety
export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

// Enhanced responsive state interface
interface ResponsiveState {
  deviceType: DeviceType;
  screenWidth: number;
  orientation: 'portrait' | 'landscape';
}

// Configuration for responsive breakpoints
interface ResponsiveConfig {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

// Default breakpoint configuration
const DEFAULT_BREAKPOINTS = {
  mobileBreakpoint: 640,
  tabletBreakpoint: 1024,
};

// Utility to determine device type based on screen width
const getDeviceType = (
  width: number,
  config: ResponsiveConfig = DEFAULT_BREAKPOINTS
): DeviceType => {
  const { mobileBreakpoint, tabletBreakpoint } = {
    ...DEFAULT_BREAKPOINTS,
    ...config,
  };

  if (width < mobileBreakpoint) return DeviceType.Mobile;
  if (width < tabletBreakpoint) return DeviceType.Tablet;
  return DeviceType.Desktop;
};

// Determine screen orientation
const getOrientation = (): 'portrait' | 'landscape' =>
  window.innerWidth < window.innerHeight ? 'portrait' : 'landscape';

export const useResponsive = (config: ResponsiveConfig = {}): ResponsiveState => {
  const mergedConfig = { ...DEFAULT_BREAKPOINTS, ...config };

  const [state, setState] = useState<ResponsiveState>({
    deviceType: getDeviceType(0, mergedConfig),
    screenWidth: 0,
    orientation: getOrientation(),
  });

  // Memoized resize handler to prevent unnecessary re-renders
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setState({
      deviceType: getDeviceType(width, mergedConfig),
      screenWidth: width,
      orientation: getOrientation(),
    });
  }, [mergedConfig]);

  useEffect(() => {
    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Optional: handle orientation change for mobile devices
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  return state;
};

// Utility hooks for specific device type checks
export const useMobile = (config?: ResponsiveConfig): boolean => {
  const { deviceType } = useResponsive(config);
  return deviceType === DeviceType.Mobile;
};

export const useTablet = (config?: ResponsiveConfig): boolean => {
  const { deviceType } = useResponsive(config);
  return deviceType === DeviceType.Tablet;
};

export const useDesktop = (config?: ResponsiveConfig): boolean => {
  const { deviceType } = useResponsive(config);
  return deviceType === DeviceType.Desktop;
};
