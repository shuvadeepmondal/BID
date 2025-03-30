import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

// Update the Offer interface to match the actual API response
interface Offer {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  buyer: {
    _id: string;
    email: string;
    name: string;
  };
  offeredPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuthContext();

  useEffect(() => {
    fetch("http://localhost:5050/api/offers/my-offers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user?.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }
        return response.json();
      })
      .then((data: Offer[]) => {
        setOffers(data);
        console.log("Data is", data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [state.user?.token]);

  if (loading)
    return <p className="text-center text-gray-500">Loading offers...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Offers</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length === 0 ? (
          <p className="text-gray-600">No offers found</p>
        ) : (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {offer.product.name}
              </h3>
              <p className="text-gray-700">
                <strong>Price:</strong> ${offer.offeredPrice}
              </p>
              <p className="text-gray-600">
                <strong>Buyer:</strong> {offer.buyer.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {offer.buyer.email}
              </p>
              <p
                className={`font-semibold ${
                  offer.status === "active"
                    ? "text-green-500"
                    : offer.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                <strong>Status:</strong> {offer.status}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Created: {new Date(offer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OffersPage;
