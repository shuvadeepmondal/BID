import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { OffersList } from "./offers/OffersList";
import { Comment, Offer } from "./offers/types";

const OffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedOffers, setExpandedOffers] = useState<Record<string, boolean>>(
    {}
  );

  const { state } = useAuthContext();

  // Sample dummy data for offers
  const dummyOffers: Offer[] = [
    {
      _id: "offer1",
      product: {
        _id: "product1",
        name: "iPhone 13 Pro",
        images: ["https://via.placeholder.com/150"],
        price: 999.99,
      },
      buyer: {
        _id: "buyer1",
        name: "John Doe",
        email: "john@example.com",
      },
      offeredPrice: 850.0,
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      _id: "offer2",
      product: {
        _id: "product2",
        name: "MacBook Air M1",
        images: ["https://via.placeholder.com/150"],
        price: 1299.99,
      },
      buyer: {
        _id: "buyer2",
        name: "Jane Smith",
        email: "jane@example.com",
      },
      offeredPrice: 1100.0,
      status: "accepted",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      _id: "offer3",
      product: {
        _id: "product3",
        name: "Sony PlayStation 5",
        images: ["https://via.placeholder.com/150"],
        price: 499.99,
      },
      buyer: {
        _id: "buyer3",
        name: "Mike Johnson",
        email: "mike@example.com",
      },
      offeredPrice: 450.0,
      status: "rejected",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
  ];

  // Sample dummy data for comments
  const dummyComments: Record<string, Comment[]> = {
    offer1: [
      {
        id: "comment1",
        offerId: "offer1",
        userId: "seller1",
        userName: "Seller",
        message: "Thanks for your offer. Could you go a bit higher?",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comment2",
        offerId: "offer1",
        userId: "buyer1",
        userName: "John Doe",
        message: "I can go up to $875. That's my best offer.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  // Initialize state with dummy data instead of fetching from backend
  useEffect(() => {
    setLoading(true);

    // Set offers with dummy data
    setOffers(dummyOffers);

    // Initialize comments with dummy data
    const initialComments: Record<string, Comment[]> = {};
    const initialExpanded: Record<string, boolean> = {};
    const initialNewComment: Record<string, string> = {};

    dummyOffers.forEach((offer) => {
      initialComments[offer._id] = dummyComments[offer._id] || [];
      initialExpanded[offer._id] = false;
      initialNewComment[offer._id] = "";
    });

    setComments(initialComments);
    setExpandedOffers(initialExpanded);
    setNewComment(initialNewComment);
    setLoading(false);
  }, []);

  // Handle offer response (accept/reject) - using dummy data
  const handleOfferResponse = (
    offerId: string,
    status: "accepted" | "rejected"
  ) => {
    // Simulate a short delay to mimic API call
    setTimeout(() => {
      // Update the offers list with the updated status
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, status } : offer
        )
      );

      // Show a success message (optional)
      console.log(`Offer ${offerId} ${status} successfully`);
    }, 300);
  };

  // Toggle comment section visibility
  const toggleComments = (offerId: string) => {
    setExpandedOffers((prev) => ({
      ...prev,
      [offerId]: !prev[offerId],
    }));
  };

  // Handle new comment input change
  const handleCommentChange = (offerId: string, value: string) => {
    setNewComment((prev) => ({
      ...prev,
      [offerId]: value,
    }));
  };

  // Add a new comment - using dummy data
  const addComment = (offerId: string) => {
    if (!newComment[offerId].trim()) return;

    // Create a new comment object
    const newCommentObj: Comment = {
      id: `comment${Date.now()}`,
      offerId,
      userId: "current-user",
      userName: state.user?.email || "You",
      message: newComment[offerId],
      timestamp: new Date().toISOString(),
    };

    // Add comment to the list
    setComments((prev) => ({
      ...prev,
      [offerId]: [...(prev[offerId] || []), newCommentObj],
    }));

    // Clear the input
    setNewComment((prev) => ({
      ...prev,
      [offerId]: "",
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-xl">Loading offers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto">
      <div className="header my-3 h-12 px-10 flex items-center justify-between">
        <h1 className="font-medium text-2xl">My Offers</h1>
      </div>

      <OffersList
        offers={offers}
        comments={comments}
        expandedOffers={expandedOffers}
        newComment={newComment}
        onToggleComments={toggleComments}
        onOfferResponse={handleOfferResponse}
        onCommentChange={handleCommentChange}
        onAddComment={addComment}
        formatDate={formatDate}
      />
    </div>
  );
};

export default OffersPage;
