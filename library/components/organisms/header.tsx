import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

import NavGroup from "@/components/molecules/nav-group";
import { cn } from "@/utils";

const Header = ({ className }: { className?: string }) => {
  const segments = useSelectedLayoutSegments();

  const navs = useMemo(
    () => [
      {
        title: "Home",
        value: "home",
        href: "/",
        isActive: segments.length === 0,
      },
      {
        title: "Collectives",
        value: "collectives",
        href: "/collectives",
        isActive: segments.includes("collectives"),
      },
      {
        title: "Recipients",
        value: "recipients",
        href: "/recipients",
        isActive: segments.includes("recipients"),
      },
      {
        title: "Collectors",
        value: "collectors",
        href: "/collectors",
        isActive: segments.includes("collectors"),
      },
      {
        title: "Docs",
        value: "docs",
        href: "/documentation",
        isActive: segments.includes("documentation"),
      },
    ],
    [segments],
  );

  return (
    <div
      className={cn(
        "flex justify-between items-center px-8 py-4 min-h-[70px] bg-transparent",
        className,
      )}
    >
      {/* <img src="/logo.svg" alt="" /> */}
      <p className="text-4xl w-full">🔭</p>
      <NavGroup className="flex w-full justify-center" navs={navs} />
      <div className="flex justify-end w-full">
        <DynamicWidget />
      </div>
    </div>
  );
};

export default Header;
