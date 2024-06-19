import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

import NavGroup from "@/components/molecules/nav-group";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

const Header = ({ className }: { className?: string }) => {
  const segments = useSelectedLayoutSegments();

  const navs = useMemo(
    () => [
      {
        title: "Intents",
        value: "intent",
        href: "/",
        isActive: segments.length === 0,
      },
      {
        title: "My Swaps",
        value: "swaps",
        href: "/swaps",
        isActive: segments.includes("swaps"),
      },
      {
        title: "Markets",
        value: "markets",
        href: "/markets",
        isActive: segments.includes("markets"),
      },
      {
        title: "Docs",
        value: "docs",
        href: "/documentation",
        isActive: segments.includes("documentation"),
      },
    ],
    [segments]
  );

  return (
    <div
      className={` flex justify-between items-center px-4 min-h-[70px] bg-transparent pr-8 ${className}`}
    >
      {/* <img src="/logo.svg" alt="" /> */}
      <p className=" text-4xl">🔭</p>
      <NavGroup navs={navs} />
      <DynamicWidget />
    </div>
  );
};

export default Header;
