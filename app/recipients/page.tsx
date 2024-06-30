import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import Card from "@/components/atoms/card";
import GlassContainer from "@/components/molecules/glass-container";
import { RecipientHead, RecipientBody } from "@/components/molecules/recipient";
import { Recipient } from "@/types";

const sampleRecipients: Recipient[] = [
  {
    id: "1",
    name: "Local Community Center",
    type: "organization",
    profileLogoUrl:
      "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    fundingFlows: [
      {
        id: "flow1",
        name: "Community Fund A",
        amount: 500,
        imageUrl:
          "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "flow2",
        name: "Education Grant B",
        amount: 1000,
        imageUrl:
          "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "flow1",
        name: "Community Fund A",
        amount: 500,
        imageUrl:
          "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "flow2",
        name: "Education Grant B",
        amount: 1000,
        imageUrl:
          "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "flow1",
        name: "Community Fund A",
        amount: 500,
        imageUrl:
          "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "flow2",
        name: "Education Grant B",
        amount: 1000,
        imageUrl:
          "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    id: "2",
    name: "Local Community Center",
    type: "organization",
    profileLogoUrl:
      "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
    fundingFlows: [],
  },
  // Add more sample recipients here if needed
];

const MarketsHome = () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Recipients</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Generated demo recipients flow details
      </p>
      <div className="flex flex-col gap-4 rounded-2xl bg-[#F8F8F7] p-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Recipients here are generated, go into the{" "}
            <Link
              href="/collectives"
              className="text-[#F26DB7] hover:underline"
            >
              Collectives
            </Link>{" "}
            or{" "}
            <Link href="/collectors" className="text-[#F26DB7] hover:underline">
              Collectors
            </Link>{" "}
            to use them
          </AlertDescription>
        </Alert>
        <Accordion type="multiple" className="w-full flex flex-col gap-2">
          {sampleRecipients.map((recipient) => (
            <Card key={recipient.id} className="rounded-lg p-0">
              <AccordionItem value={recipient.id} className="border-b-0">
                <AccordionTrigger className="p-4">
                  <RecipientHead item={recipient} />
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-4">
                  <RecipientBody item={recipient} />
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      </div>
    </GlassContainer>
  );
};

export default MarketsHome;
