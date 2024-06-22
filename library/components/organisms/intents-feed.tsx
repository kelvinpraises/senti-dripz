import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import {
  IntentBody,
  IntentHead,
  SwapIntent,
} from "@/components/molecules/intent";
import NewIntent from "@/components/molecules/new-intent";

const IntentsFeed = ({
  swapIntents,
  showNewIntent = true,
}: {
  swapIntents: SwapIntent[];
  showNewIntent?: boolean;
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {showNewIntent && <NewIntent />}
      {swapIntents.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b-2">
          <AccordionTrigger>
            <IntentHead item={item} />
          </AccordionTrigger>
          <AccordionContent>
            <IntentBody item={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default IntentsFeed;
