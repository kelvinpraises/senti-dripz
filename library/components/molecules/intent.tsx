import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";

export type SwapIntent = {
  id: string;
  creator: string;
  status: string;
  created_at: number;
  updated_at: number;
  from: {
    address: string;
    ticker: string;
    amount: number;
  };
  to: {
    address: string;
    ticker: string;
    amount: number;
  };
  rate: number;
  gated: {
    account?: {
      address: string;
    };
    in_collection?: {
      address: string;
    };
    min_balance?: {
      address: string;
      amount: number;
    };
    token_id?: {
      address: string;
      id: number;
    };
  };
  notes?: string;
};

type GatingData =
  | { address: string }
  | { address: string }
  | { address: string; amount: number }
  | { address: string; ids: number[] };

const IntentHead = ({ item }: { item: SwapIntent }) => {
  const { from, to, status } = item;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center">
        <div className="relative w-fit">
          <img
            src={`/tokens/${from.ticker}.svg`}
            alt={from.ticker}
            className="w-8 h-8"
          />
          <img
            src={`/tokens/${to.ticker}.svg`}
            alt={to.ticker}
            className="w-6 h-6 absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{`${from.ticker.toUpperCase()} to ${to.ticker.toUpperCase()}`}</h3>
      </div>
      <div className="flex gap-2 bg-slate-200 p-1 rounded-lg text-gray-700">
        <p className="text-sm w-fit">@ {status}</p>
        <p className="text-sm w-fit">@ 3,000,000,000</p>
        <p className="text-sm w-fit">@ 0.4666</p>
      </div>
    </div>
  );
};

const IntentBody = ({ item }: { item: SwapIntent }) => {
  const { from, to, rate, creator, gated, notes } = item;

  const renderGatingMessage = (
    type: keyof SwapIntent["gated"],
    data: GatingData
  ) => {
    switch (type) {
      case "account":
        return `You need to swap with the account: ${data.address}`;
      case "in_collection":
        return `You need to own a token from the collection: ${data.address}`;
      case "min_balance":
        return `You need to have a minimum balance of ${
          (data as { amount: number }).amount
        } ${data.address}`;
      case "token_id":
        return `You need to own one of the following token IDs from ${
          data.address
        }: ${(data as unknown as { id: number }).id}`;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex flex-col gap-2 text-gray-700 text-base font-semibold w-full">
          <div>
            <div className="flex items-center gap-2">
              <p className="w-[11ch] whitespace-nowrap">You'll get their</p>
              <input
                type="number"
                value={from.amount}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-40"
              />
              <p className="w-[5ch]">{from.ticker.toUpperCase()}</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="w-[11ch] whitespace-nowrap">They get your</p>
              <input
                type="number"
                value={to.amount}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-40"
              />
              <p className="w-[5ch]">{to.ticker.toUpperCase()}</p>
            </div>
          </div>

          <p className=" text-gray-500 font-bold text-xs">
            {from.amount} {from.ticker.toUpperCase()} for {to.amount}{" "}
            {to.ticker.toUpperCase()} @ {rate} {from.ticker.toUpperCase()}/
            {to.ticker.toUpperCase()}
          </p>
        </div>
        <div className="flex w-full gap-2 items-center">
          <Separator
            className=" bg-slate-200 hidden sm:block"
            orientation="vertical"
          />
          <Button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Confirm Swap
          </Button>
        </div>
      </div>
      <Separator className=" bg-slate-200" />
      {Object.keys(gated).length > 0 && (
        <>
          <div>
            {Object.entries(gated).map(([type, data]) => {
              const message = renderGatingMessage(
                type as keyof SwapIntent["gated"],
                data as GatingData
              );
              return message ? (
                <p key={type} className="">
                  {message}
                </p>
              ) : null;
            })}
          </div>
          <Separator className=" bg-slate-200" />
        </>
      )}
      {notes && (
        <>
          <p className="">{notes}</p>
          <Separator className=" bg-slate-200" />
        </>
      )}
      <p>Creator: {creator}</p>
    </div>
  );
};

export { IntentBody, IntentHead };
