import Image from "next/image";

import GlassContainer from "@/components/molecules/glass-container";

const IntentsHome = async () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 pb-2 font-semibold text-xl">Home</p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <h2 className="text-xl text-center sm:text-3xl text-black">
          Query them Swaps! On your terms.
        </h2>
        <Image
          alt="query intents"
          src="https://illustrations.popsy.co/pink/business-success-chart.svg"
          width={400}
          height={400}
        />
      </div>
    </GlassContainer>
  );
};

export default IntentsHome;
