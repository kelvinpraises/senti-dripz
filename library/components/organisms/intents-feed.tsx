import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { IntentHead, IntentBody } from "../molecules/intent";
import { Button } from "../atoms/button";

const swapIntents = [
  {
    id: "swap-intent-1",
    creator: "0x1234567890",
    status: "Open",
    created_at: 1687334400,
    updated_at: 1687334400,
    from: {
      address: "0x1111111111",
      ticker: "usdc",
      amount: 5000,
    },
    to: {
      address: "0x1111111111",
      ticker: "aero",
      amount: 3000,
    },
    rate: 0.6,
    deadline: 1687593600,
    min_swap_amount: 1000,
    filled_amount: 0,
    gated: {
      // account: {
      //   address: "0x0987654321",
      // },
      // in_collection: {
      //   address: "0x1111111111",
      // },
      // min_balance: {
      //   address: "0x2222222222",
      //   amount: 1000,
      // },
      // token_id: {
      //   address: "0x3333333333",
      //   ids: [1, 2, 3],
      // },
    },
    // notes: "This is a sample swap intent",
  },
  {
    id: "swap-intent-2",
    creator: "0x1234567890",
    status: "Open",
    created_at: 1687334400,
    updated_at: 1687334400,
    from: {
      address: "0x1111111111",
      ticker: "wblt",
      amount: 5000,
    },
    to: {
      address: "0x1111111111",
      ticker: "usdc",
      amount: 3000,
    },
    rate: 0.6,
    deadline: 1687593600,
    min_swap_amount: 1000,
    filled_amount: 0,
    gated: {
      account: {
        address: "0x0987654321",
      },
      in_collection: {
        address: "0x1111111111",
      },
      min_balance: {
        address: "0x2222222222",
        amount: 1000,
      },
      token_id: {
        address: "0x3333333333",
        ids: [1, 2, 3],
      },
    },
    notes: "This is a sample swap intent",
  },
  {
    id: "swap-intent-3",
    creator: "0x1234567890",
    status: "Open",
    created_at: 1687334400,
    updated_at: 1687334400,
    from: {
      address: "0x1111111111",
      ticker: "aero",
      amount: 5000,
    },
    to: {
      address: "0x1111111111",
      ticker: "wblt",
      amount: 3000,
    },
    rate: 0.6,
    deadline: 1687593600,
    min_swap_amount: 1000,
    filled_amount: 0,
    gated: {
      account: {
        address: "0x0987654321",
      },
      in_collection: {
        address: "0x1111111111",
      },
      min_balance: {
        address: "0x2222222222",
        amount: 1000,
      },
      token_id: {
        address: "0x3333333333",
        ids: [1, 2, 3],
      },
    },
    notes: "This is a sample swap intent",
  },
];

const IntentsAccordionFeed = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <Button
      // handleClick={function (): void {
      //   throw new Error("Function not implemented.");
      // }}
      >
        New Intent
      </Button>
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

export default IntentsAccordionFeed;
