"use client";

import { Inter } from "next/font/google";

import AuroraBackground from "@/components/atoms/aurora-background";
import Header from "@/components/organisms/header";
import RootProvider from "@/providers";
import { cn } from "@/utils";
import LoansMarquee from "@/components/molecules/loans-marquee";

const inter = Inter({ subsets: ["latin"], preload: true });

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <RootProvider>
          <AuroraBackground>
            <main className="flex flex-col gap-2 w-screen relative h-screen">
              <LoansMarquee/>
              <Header />
              {children}
            </main>
          </AuroraBackground>
        </RootProvider>
      </body>
    </html>
  );
};

export default LayoutWrapper;
