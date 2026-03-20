import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { BrandingProvider } from "@/components/BrandingProvider";

const inter = Inter({ subsets: ["latin"] });

async function getBranding() {
  try {
    const res = await fetch('http://localhost:3000/api/branding', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getSEO() {
  try {
    const res = await fetch('http://localhost:3000/api/seo', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateViewport(): Promise<Viewport> {
  const branding = await getBranding();
  return {
    themeColor: branding?.primaryColor || "#8b5cf6",
    width: "device-width",
    initialScale: 1,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const [seo, branding] = await Promise.all([getSEO(), getBranding()]);
  
  return {
    title: seo?.title || branding?.siteName || "x-cryptopay",
    description: seo?.description || "The Premium Payment Gateway",
    keywords: seo?.keywords || "crypto, payment",
    icons: branding?.faviconUrl ? [{ rel: 'icon', url: branding.faviconUrl }] : undefined,
    openGraph: {
      title: seo?.ogTitle || seo?.title || branding?.siteName,
      description: seo?.ogDescription || seo?.description,
      url: seo?.ogUrl,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBranding();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} bg-black text-slate-100 antialiased relative min-h-screen`}>
        <style id="branding-theme" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${branding?.primaryColor || '#8b5cf6'};
          }
        `}} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
        <Providers>
          <BrandingProvider initialBranding={branding}>
            <Navbar />
            <main className="pt-24 min-h-screen">{children}</main>
          </BrandingProvider>
        </Providers>
      </body>
    </html>
  );
}
