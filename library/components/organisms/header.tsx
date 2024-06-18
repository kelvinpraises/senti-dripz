import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

import RouteTabs from "@/components/molecules/route-tabs";

const tabs = [
  {
    title: "Intents",
    value: "intent",
  },
  {
    title: "My Swaps",
    value: "swaps",
  },
  {
    title: "Markets",
    value: "markets",
  },
  {
    title: "Docs",
    value: "docs",
  },
];

const Header = ({ className }: { className?: string }) => {
  return (
    <div
      className={` flex justify-between items-center px-4 min-h-[70px] bg-transparent pr-8 ${className}`}
    >
      {/* <img src="/logo.svg" alt="" /> */}
      <p className=" text-4xl">🔭</p>
      <RouteTabs tabs={tabs} />
      <DynamicWidget />
    </div>
  );
};

export default Header;
