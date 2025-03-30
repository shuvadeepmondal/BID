import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

// Updated interface to match the API response
interface Offer {
  _id: string;
  product: {
    _id: string;
    name: string;
    user: string; // Seller ID
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  offeredPrice: number;
  status: "accepted"; // Since we’re only fetching accepted offers
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const RecivedOrder: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuthContext();

  useEffect(() => {
    const fetchAcceptedOffers = async () => {
      if (!state.user?.token) {
        setError("Please log in to view accepted offers");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/offers/my-accepted-offers`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch accepted offers");
        }

        const { data }: { data: Offer[] } = await response.json();
        setOffers(data);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchAcceptedOffers();
  }, [state.user?.token]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; bg: string }> = {
      accepted: { color: "text-green-700", bg: "bg-green-100" },
      // Keep other statuses if you plan to reuse this elsewhere
      pending: { color: "text-yellow-700", bg: "bg-yellow-100" },
      rejected: { color: "text-red-700", bg: "bg-red-100" },
      completed: { color: "text-blue-700", bg: "bg-blue-100" },
    };

    const style = statusMap[status.toLowerCase()] || {
      color: "text-gray-700",
      bg: "bg-gray-100",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${style.color} ${style.bg}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex justify-center px-4 py-3 rounded relative my-6 mx-auto max-w-3xl">
        <div className="py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            No <span className="text-indigo-600">Accepted Offers</span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            View and manage all your accepted offers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="py-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          My <span className="text-indigo-600">Accepted Offers</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View and manage all your accepted offers
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="my-16 text-center">
          <div className="text-indigo-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No accepted offers yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your accepted offers will appear here once you accept some!
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow duration-300 p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-3 sm:mb-0">
                  <div className="flex items-center mb-1">
                    <Link
                      to={`/my-offers/${offer._id}/${offer.offeredPrice.toLocaleString()}/${encodeURIComponent(offer.product.name)}`}
                      className="text-lg font-medium text-gray-900 mr-3"
                    >
                      {offer.product.name}
                    </Link>
                    {getStatusBadge(offer.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Buyer: {offer.buyer.name} ({offer.buyer.email})
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Accepted on {new Date(offer.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-indigo-600">
                    ₹{offer.offeredPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecivedOrder;
