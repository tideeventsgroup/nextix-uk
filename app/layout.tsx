import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { Preloader } from "./preloader";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Crowdloop — Good events start here",
    description: "Discover live music, festivals, theatre and unforgettable experiences with Crowdloop.",
    icons: { icon: "/crowdloop-logo.png", shortcut: "/crowdloop-logo.png" },
    openGraph: {
      title: "Crowdloop — Good events start here",
      description: "Discover live music, festivals, theatre and unforgettable experiences.",
    },
    twitter: { card: "summary" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geist.variable}><Preloader /><SiteHeader />{children}<SiteFooter /></body></html>;
}
