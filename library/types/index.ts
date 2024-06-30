export interface AcceptedToken {
  address: string;
  name: string;
  symbol: string;
}

export interface ShopItem {
  id: string;
  name: string;
  emojiCodePoint: string;
  price: number;
}

export interface Collector {
  id: string;
  emojiCodePoint: string;
  name: string;
  creator: string;
  acceptedToken: AcceptedToken;
  shopItems: ShopItem[];
}

export interface FundingFlow {
  id: string;
  name: string;
  amount: number;
  imageUrl: string;
}

export interface Recipient {
  id: string;
  name: string;
  type: "organization" | "individual";
  profileLogoUrl: string;
  fundingFlows: FundingFlow[];
}

export interface Funding {
  id: string;
  name: string;
  emojiCodePoint: string;
  creator: string;
  status: "Open" | "Closed";
  created_at: number;
  updated_at: number;
  rate: number;
  description: string;
  startTimestamp: number;
  endTimestamp: number;
  token: {
    symbol: string;
    name: string;
    address: string;
  };
  amount: string;
  selectedMerchants: string[];
}

export interface FundRecipient {
  address: string;
  name: string;
  status:
    | "None"
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Appealed"
    | "InReview";
}
