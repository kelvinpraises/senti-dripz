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
          {[
            {
              id: "happy",
              name: "Title 1",
              creator: "string;",
              status: "Open",
              created_at: 90,
              updated_at: 90,
              rate: 90,
            },
            {
              id: "happy0",
              name: "Title 2",
              creator: "string;",
              status: "Completed",
              created_at: 90,
              updated_at: 90,
              rate: 90,
            },
            {
              id: "happy1",
              name: "Title 3",
              creator: "string;",
              status: "Closed",
              created_at: 90,
              updated_at: 90,
              rate: 90,
            },
            {
              id: "happy2",
              name: "Title 4",
              creator: "string;",
              status: "Voting",
              created_at: 90,
              updated_at: 90,
              rate: 90,
            },
          ].map((item) => (
            <Card key={item.id} className="rounded-lg p-0">
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b-0"
              >
                <AccordionTrigger className="p-4">
                  <RecipientHead item={item} />
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-4">
                  <RecipientBody item={item} />
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
