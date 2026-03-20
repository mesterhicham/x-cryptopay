"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Branding {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  pwaLogoUrl: string;
}

const BrandingContext = createContext<Branding | null>(null);

export function BrandingProvider({ 
  children, 
  initialBranding 
}: { 
  children: React.ReactNode;
  initialBranding: Branding | null;
}) {
  const [branding, setBranding] = useState<Branding | null>(initialBranding);

  useEffect(() => {
    if (branding?.primaryColor) {
      document.documentElement.style.setProperty('--primary', branding.primaryColor);
    }
  }, [branding]);

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
}

export const useBranding = () => useContext(BrandingContext);
