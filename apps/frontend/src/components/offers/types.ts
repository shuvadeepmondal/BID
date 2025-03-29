// Define the Offer type based on the backend model
export interface Offer {
  _id: string;
  product: {
    _id: string;
    name: string;
    images?: string[];
    price?: number;
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  offeredPrice: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

// Interface for comments/negotiations
export interface Comment {
  id: string;
  offerId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

// Interface for the offers data structure
export interface OffersData {
  offers: Offer[];
  comments: Record<string, Comment[]>;
}
