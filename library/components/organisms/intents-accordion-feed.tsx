import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";

const cryptoAccordionItems = [
  {
    value: "item-1",
    trigger: "What is Bitcoin?",
    content:
      "Bitcoin is a decentralized digital currency that enables peer-to-peer transactions without the need for intermediaries like banks.",
  },
  {
    value: "item-2",
    trigger: "How does blockchain work?",
    content:
      "Blockchain is a distributed ledger technology that records transactions across a network of computers, ensuring transparency, security, and immutability.",
  },
  {
    value: "item-3",
    trigger: "What is Ethereum?",
    content:
      "Ethereum is a decentralized platform that enables developers to build and deploy smart contracts and decentralized applications (dApps).",
  },
  {
    value: "item-4",
    trigger: "What are smart contracts?",
    content:
      "Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They automatically enforce the terms without the need for intermediaries.",
  },
  {
    value: "item-5",
    trigger: "What is cryptocurrency mining?",
    content:
      "Cryptocurrency mining is the process of verifying and adding new transactions to the blockchain. Miners solve complex mathematical problems to validate transactions and are rewarded with cryptocurrency.",
  },
  {
    value: "item-6",
    trigger: "What is a cryptocurrency wallet?",
    content:
      "A cryptocurrency wallet is a software program or physical device that stores the private and public keys required to send and receive cryptocurrency transactions.",
  },
  {
    value: "item-7",
    trigger: "What is an Initial Coin Offering (ICO)?",
    content:
      "An Initial Coin Offering (ICO) is a fundraising method used by blockchain startups to raise capital by selling their own cryptocurrency tokens to investors.",
  },
  {
    value: "item-8",
    trigger: "What is a stablecoin?",
    content:
      "A stablecoin is a type of cryptocurrency that is designed to maintain a stable value, typically pegged to a fiat currency like the US dollar or a commodity like gold.",
  },
  {
    value: "item-9",
    trigger: "What is a decentralized exchange (DEX)?",
    content:
      "A decentralized exchange (DEX) is a cryptocurrency exchange that operates on a blockchain network, allowing users to trade cryptocurrencies directly with each other without the need for a central authority.",
  },
  {
    value: "item-10",
    trigger: "What is DeFi?",
    content:
      "DeFi (Decentralized Finance) refers to a ecosystem of financial applications built on blockchain technology, offering services such as lending, borrowing, trading, and insurance without the need for traditional financial intermediaries.",
  },
];

const IntentsAccordionFeed = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {cryptoAccordionItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default IntentsAccordionFeed;
