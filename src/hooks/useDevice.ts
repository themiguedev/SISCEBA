import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'tv';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  deviceType: DeviceType;
  orientation: Orientation;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  pixelRatio: number;
}

/**
 * Hook para detección en tiempo real del tipo de dispositivo y características de pantalla.
 * Permite adaptar dinámicamente la UI entre teléfonos móviles, tablets, computadoras y pantallas grandes.
 */
export const useDevice = (): DeviceInfo => {
  const getDeviceInfo = (): DeviceInfo => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        orientation: 'landscape',
        width: 1200,
        height: 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        pixelRatio: 1
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    let deviceType: DeviceType = 'desktop';
    if (width < 640) {
      deviceType = 'mobile';
    } else if (width >= 640 && width < 1024) {
      deviceType = 'tablet';
    } else if (width >= 1024 && width < 1920) {
      deviceType = 'desktop';
    } else {
      deviceType = 'tv';
    }

    return {
      deviceType,
      orientation,
      width,
      height,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop' || deviceType === 'tv',
      isTouch,
      pixelRatio: window.devicePixelRatio || 1
    };
  };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: any = null;
    const handleResize = () => {
      // Debounce para optimizar rendimiento de re-cálculo
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 60);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
};
