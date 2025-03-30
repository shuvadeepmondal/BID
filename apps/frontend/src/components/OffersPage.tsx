import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

interface Offer {
  _id: string;
  product: {
    _id: string;
    name: string;
    category?: string;
  };
  offeredPrice: number;
  originalPrice?: number;
  status: string;
  createdAt?: string;
}

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuthContext();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/offers/my-offers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user?.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch offers");
        return response.json();
      })
      .then((data: Offer[]) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [state.user?.token]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; bg: string }> = {
      pending: { color: "text-yellow-700", bg: "bg-yellow-100" },
      accepted: { color: "text-green-700", bg: "bg-green-100" },
      rejected: { color: "text-red-700", bg: "bg-red-100" },
      completed: { color: "text-blue-700", bg: "bg-blue-100" },
      // Add more statuses as needed
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-6 mx-auto max-w-3xl">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="py-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          My <span className="text-indigo-600">Offers</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and track all your submitted offers
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
          <h3 className="text-lg font-medium text-gray-900">No offers yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start browsing products and make your first offer!
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
                  {offer.product.category && (
                    <p className="text-sm text-gray-500">
                      {offer.product.category}
                    </p>
                  )}
                  {offer.createdAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Offered on{" "}
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-indigo-600">
                    ₹{offer.offeredPrice.toLocaleString()}
                  </span>
                  {offer.originalPrice && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400 line-through">
                        ₹{offer.originalPrice.toLocaleString()}
                      </span>
                      {offer.originalPrice > offer.offeredPrice && (
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                          {Math.round(
                            ((offer.originalPrice - offer.offeredPrice) /
                              offer.originalPrice) *
                              100
                          )}
                          % off
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
