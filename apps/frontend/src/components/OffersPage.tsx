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
  console.log(offers);
  
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
    <div className="w-[95%] mx-auto mb-[20rem]">
      <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-indigo-400 rounded-[100%] top-[70%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
      <div className="header my-4 h-12 px-10 flex items-center justify-center">
        <h1 className="font-bold text-3xl">My <span className="text-indigo-600">Offers</span></h1>
      </div>
    </div>
  );
};

export default OffersPage;
