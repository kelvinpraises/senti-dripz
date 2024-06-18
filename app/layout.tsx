import type { Metadata } from "next";
import { Inter } from "next/font/google";

import LayoutWrapper from "@/components/template/layout-wrapper";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://starklens.vercel.app/"),
  title: "Starklens",
  icons: "/favicon.ico",
  description: "",
  openGraph: {
    images: "", //TODO:
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
