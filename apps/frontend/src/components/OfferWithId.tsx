import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";


const OfferWithId = () => {
  const { id, price, name } = useParams<{
    id: string;
    price: string;
    name: string;
  }>();
  const { state } = useAuthContext(); // Type assertion for auth context
  const navigate = useNavigate();
  const [landmark, setLandmark] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle accept/reject offer
  const handleOfferResponse = async (status: "accepted" | "rejected") => {
    if (!state.user?.token || !id) {
      setError("Please log in to respond to this offer");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const body: {
      offerId: string;
      status: "accepted" | "rejected";
      landmark?: string;
    } = {
      offerId: id,
      status,
    };
    if (status === "accepted") {
      if (!landmark.trim()) {
        setError("Please provide a landmark to accept the offer");
        setLoading(false);
        return;
      }
      body.landmark = landmark;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/api/offers/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user.token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to respond to offer");
      }

      const data = await response.json();
      console.log(data);
      
      setSuccess(
        status === "accepted"
          ? "Offer accepted! Deal created successfully."
          : "Offer rejected successfully."
      );
      setTimeout(() => navigate("/my-offers"), 2000); // Redirect after 2s
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error responding to offer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Offer Details
          </h1>
        </div>

        {/* Offer Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Offer ID</p>
              <p className="text-lg font-medium text-gray-900 truncate">{id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="text-lg font-medium text-gray-900">
                {decodeURIComponent(name || "")}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Offered Price</p>
            <p className="text-3xl font-bold text-blue-600">₹{price}</p>
          </div>
        </div>

        {/* Landmark Input */}
        <div className="mt-8">
          <label
            htmlFor="landmark"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Meeting Landmark{" "}
            <span className="text-gray-500">(Required to Accept)</span>
          </label>
          <input
            type="text"
            id="landmark"
            value={landmark}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLandmark(e.target.value)
            }
            placeholder="e.g., Library Gate"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          />
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => handleOfferResponse("accepted")}
            disabled={loading}
            className={`flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Accept Offer</span>
          </button>
          <button
            onClick={() => handleOfferResponse("rejected")}
            disabled={loading}
            className={`flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>Reject Offer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferWithId;
