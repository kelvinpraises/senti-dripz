"use client";

import { Marquee } from "@/components/atoms/marquee";
import { useEffect, useState } from "react";

interface Swap {
  fromAmount: number;
  fromToken: string;
  toAmount: number;
  toToken: string;
}

const swaps: Swap[] = [
  { fromAmount: 20, fromToken: "USD", toAmount: 4, toToken: "BONK" },
  { fromAmount: 100, fromToken: "ETH", toAmount: 500, toToken: "XYZ" },
  { fromAmount: 50, fromToken: "BTC", toAmount: 1000, toToken: "ABC" },
  { fromAmount: 75, fromToken: "LTC", toAmount: 200, toToken: "DEF" },
  { fromAmount: 30, fromToken: "USDT", toAmount: 10, toToken: "GHI" },
];

const generateSwapNotification = (
  fromAmount: number,
  fromToken: string,
  toAmount: number,
  toToken: string
): string => {
  const messages = [
    `🚀 Exciting swap alert! ${fromAmount} ${fromToken} is blasting off to ${toAmount} ${toToken}. Hop on board!`,
    `🌟 Attention all token enthusiasts! A stellar swap of ${fromAmount} ${fromToken} for ${toAmount} ${toToken} is happening now. Don't miss out!`,
    `🔥 Hot swap incoming! ${fromAmount} ${fromToken} is being exchanged for ${toAmount} ${toToken}. Get ready for some sizzling token action!`,
    `💰 Money moves! Someone is swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}. Watch the tokens fly!`,
    `🎉 It's a token party! ${fromAmount} ${fromToken} is being traded for ${toAmount} ${toToken}. Join the celebration!`,
    `🚨 Swap alert! ${fromAmount} ${fromToken} is being converted to ${toAmount} ${toToken}. Witness the token transformation!`,
    `🌈 A colorful swap is in progress! ${fromAmount} ${fromToken} is morphing into ${toAmount} ${toToken}. Observe the token metamorphosis!`,
    `⚡ Lightning-fast swap detected! ${fromAmount} ${fromToken} is zapping into ${toAmount} ${toToken}. Blink and you might miss it!`,
    `🎩 Abracadabra! ${fromAmount} ${fromToken} is magically transforming into ${toAmount} ${toToken}. Witness the token sorcery!`,
    `🌞 A bright and sunny swap is happening! ${fromAmount} ${fromToken} is radiating into ${toAmount} ${toToken}. Bask in the token glow!`,
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

const generateSwapNotifications = (swaps: Swap[]): string[] => {
  return swaps.map(({ fromAmount, fromToken, toAmount, toToken }) =>
    generateSwapNotification(fromAmount, fromToken, toAmount, toToken)
  );
};

const SwapMarquee = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const generatedNotifications = generateSwapNotifications(swaps);
    setNotifications(generatedNotifications);
  }, []);

  if (notifications.length === 0) {
    return null; // Render nothing until notifications are generated
  }

  return (
    <Marquee speed="slow">
      {notifications.map((notification, index) => (
        <li key={index} className="relative rounded-2xl flex-shrink-0 p-1">
          <span className="relative z-20 text-sm leading-[1.6] font-normal">
            {notification}
          </span>
        </li>
      ))}
    </Marquee>
  );
};

export default SwapMarquee;
