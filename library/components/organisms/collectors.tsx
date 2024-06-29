import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import Card from "@/components/atoms/card";
import { CollectorBody, CollectorHead } from "@/components/molecules/collector";
import NewCollector from "@/components/molecules/new-collector";

const Collectors = () => {
  return (
    <div className="flex flex-col gap-4">
      <NewCollector />
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
            <AccordionItem key={item.id} value={item.id} className="border-b-0">
              <AccordionTrigger className="p-4">
                <CollectorHead item={item} />
              </AccordionTrigger>
              <AccordionContent className="pb-4 px-4">
                <CollectorBody item={item} />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default Collectors;
