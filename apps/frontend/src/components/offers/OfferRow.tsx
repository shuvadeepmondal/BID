import { FaCheck, FaComment, FaTimes } from "react-icons/fa";
import { Offer } from "./types";

interface OfferRowProps {
  offer: Offer;
  isExpanded: boolean;
  onToggleComments: (offerId: string) => void;
  onOfferResponse: (offerId: string, status: "accepted" | "rejected") => void;
  formatDate: (dateString: string) => string;
}

export const OfferRow: React.FC<OfferRowProps> = ({
  offer,
  isExpanded,
  onToggleComments,
  onOfferResponse,
  formatDate,
}) => {
  return (
    <tr key={offer._id} className="border-t">
      <td className="p-2 flex items-center">
        {offer.product.images && offer.product.images[0] && (
          <img
            src={offer.product.images[0]}
            alt={offer.product.name}
            className="h-8 w-8 mr-2 rounded"
          />
        )}
        <span>{offer.product.name}</span>
      </td>
      <td className="p-2">{offer.buyer.name}</td>
      <td className="p-2">${offer.product.price?.toFixed(2) || "N/A"}</td>
      <td className="p-2">${offer.offeredPrice.toFixed(2)}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            offer.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : offer.status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
        </span>
      </td>
      <td className="p-2">{formatDate(offer.createdAt)}</td>
      <td className="p-2">
        <div className="flex justify-center gap-2">
          {offer.status === "pending" && (
            <>
              <button
                onClick={() => onOfferResponse(offer._id, "accepted")}
                className="rounded-md hover:bg-green-100 text-green-600 p-2 flex items-center"
              >
                <FaCheck className="w-4 h-4 mr-1" />
                Accept
              </button>
              <button
                onClick={() => onOfferResponse(offer._id, "rejected")}
                className="rounded-md hover:bg-red-100 text-red-600 p-2 flex items-center"
              >
                <FaTimes className="w-4 h-4 mr-1" />
                Reject
              </button>
            </>
          )}
          <button
            onClick={() => onToggleComments(offer._id)}
            className="rounded-md hover:bg-blue-100 text-blue-600 p-2 flex items-center"
          >
            <FaComment className="w-4 h-4 mr-1" />
            {isExpanded ? "Hide" : "Negotiate"}
          </button>
        </div>
      </td>
    </tr>
  );
};
