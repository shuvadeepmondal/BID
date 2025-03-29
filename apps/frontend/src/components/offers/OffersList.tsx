import React from "react";
import { NegotiationSection } from "./NegotiationSection";
import { OfferRow } from "./OfferRow";
import { Comment, Offer } from "./types";

interface OffersListProps {
  offers: Offer[];
  comments: Record<string, Comment[]>;
  expandedOffers: Record<string, boolean>;
  newComment: Record<string, string>;
  onToggleComments: (offerId: string) => void;
  onOfferResponse: (offerId: string, status: "accepted" | "rejected") => void;
  onCommentChange: (offerId: string, value: string) => void;
  onAddComment: (offerId: string) => void;
  formatDate: (dateString: string) => string;
}

export const OffersList: React.FC<OffersListProps> = ({
  offers,
  comments,
  expandedOffers,
  newComment,
  onToggleComments,
  onOfferResponse,
  onCommentChange,
  onAddComment,
  formatDate,
}) => {
  return (
    <div className="w-full m-1 bg-white shadow-lg text-lg rounded-sm border border-gray-200">
      <div className="overflow-x-auto rounded-lg p-3">
        {offers.length > 0 ? (
          <>
            <table className="table-auto w-full">
              <thead className="text-sm font-semibold uppercase text-gray-800 bg-gray-50">
                <tr>
                  <th className="p-2">Product</th>
                  <th className="p-2">Buyer</th>
                  <th className="p-2">Original Price</th>
                  <th className="p-2">Offered Price</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <OfferRow
                    key={offer._id}
                    offer={offer}
                    isExpanded={expandedOffers[offer._id]}
                    onToggleComments={onToggleComments}
                    onOfferResponse={onOfferResponse}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>

            {/* Negotiation/Comments Sections */}
            {offers.map(
              (offer) =>
                expandedOffers[offer._id] && (
                  <NegotiationSection
                    key={`negotiation-${offer._id}`}
                    offerId={offer._id}
                    productName={offer.product.name}
                    buyerName={offer.buyer.name}
                    comments={comments[offer._id] || []}
                    newComment={newComment[offer._id] || ""}
                    onCommentChange={onCommentChange}
                    onAddComment={onAddComment}
                  />
                )
            )}
          </>
        ) : (
          <div className="text-center p-4 text-gray-500">No offers found.</div>
        )}
      </div>
    </div>
  );
};
