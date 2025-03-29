import React from "react";
import { Comment } from "./types";

interface NegotiationSectionProps {
  offerId: string;
  productName: string;
  buyerName: string;
  comments: Comment[];
  newComment: string;
  onCommentChange: (offerId: string, value: string) => void;
  onAddComment: (offerId: string) => void;
}

export const NegotiationSection: React.FC<NegotiationSectionProps> = ({
  offerId,
  productName,
  buyerName,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
}) => {
  return (
    <div className="mt-4 mb-8 w-full bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">
        Negotiation for {productName} - Offered by {buyerName}
      </h3>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-3 pb-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{comment.userName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No messages yet. Start the negotiation!
          </p>
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newComment || ""}
          onChange={(e) => onCommentChange(offerId, e.target.value)}
          placeholder="Type your message here..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && onAddComment(offerId)}
        />
        <button
          onClick={() => onAddComment(offerId)}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};
