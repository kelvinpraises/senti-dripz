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
  created_at: number;
  updated_at: number;
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
  fundingFlows: FundingFlow[];
}
