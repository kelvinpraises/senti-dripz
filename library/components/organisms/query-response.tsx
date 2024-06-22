import React from "react";

import IntentsFeed from "@/components/organisms/intents-feed";
import { SwapIntent } from "@/components/molecules/intent";

type QueryResponseProps = {
  text: string;
  attachments: SwapIntent[];
};

const QueryResponse: React.FC<QueryResponseProps> = ({ text, attachments }) => {
  return (
    <div className=" w-full">
      <p className="mb-4">{text}</p>
      {attachments.length > 0 && (
        <div>
          <IntentsFeed swapIntents={attachments} showNewIntent={false} />
        </div>
      )}
    </div>
  );
};

export default QueryResponse;
