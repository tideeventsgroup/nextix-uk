import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import { SiteFooter, SiteHeader } from "./site-chrome";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Alyvra — Good events start here",
    description: "Discover live music, festivals, theatre and unforgettable experiences with Alyvra.",
    icons: { icon: "/alyvra-logo.png", shortcut: "/alyvra-logo.png" },
    openGraph: {
      title: "Alyvra — Good events start here",
      description: "Discover live music, festivals, theatre and unforgettable experiences.",
      images: [{ url: `${origin}/og.png`, width: 1728, height: 910, alt: "Alyvra — Good events start here" }],
    },
    twitter: { card: "summary_large_image", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geist.variable}><SiteHeader />{children}<SiteFooter /></body></html>;
}
