import { useEffect, useState } from "react";
import Category from "./Category";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

// Define the type for an item
interface Item {
  id: string; // Updated to string because MongoDB ObjectId is a string
  name: string;
  condition: string;
  price: number;
  verified: boolean;
  description: string;
  image: string;
}


interface ApiResponseItem {
  _id: string;
  name: string;
  images: string[];
  condition: number;
  description: string;
  category: string;
  price: number;
  acceptsCrypto: boolean;
  walletAddress: string;
  user: {
    _id: string;
    email: string;
    name: string;
  };
  campus: string;
  status: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ItemCard component
interface ItemCardProps {
  item: Item;
}
function ItemCard({ item }: ItemCardProps) {
  return (
    <Link to={`/market/${item.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-200 py-3">
      <div className="relative">
        {/* Product badge */}
        {item.verified && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Verified
            </span>
          </div>
        )}

        {/* Image container */}
        <div className="bg-gray-100 h-40 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className=" object-contain p-2 w-full h-full"
          />
        </div>
      </div>

      {/* Content section */}
      <div className=" flex flex-col items-start px-6 mt-2">
        {/* Title */}
        <h3 className="font-medium text-gray-800 text-2xl">
          {item.name} 
        </h3>
        <div className="flex justify-between gap-5">
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg
                className="w-4 h-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>

          {/* Condition badge */}
          <div className="mb-3">
            <span
              className={`inline-block text-xs px-2 py-1 rounded-md ${getConditionColor(item.condition)}`}
            >
              {item.condition}
            </span>
          </div>
        </div>
        {/* Price section */}
        <div className="mt-auto">
          <div className="flex items-center mb-1">
            <span className="text-lg font-bold text-gray-900">
              ₹{item.price}
            </span>
            <span className="text-xs text-gray-500 line-through ml-2">
              ₹{Math.round(item.price * 1.2)}
            </span>
            <span className="text-xs text-green-600 font-medium ml-2">
              20% off
            </span>
          </div>

          {/* Free delivery tag */}
          <p className="text-xs text-gray-500 mb-3">Free delivery</p>

          {/* View details button */}
          <Link to={`/product/${item.id}`} className="block w-full">
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded flex items-center justify-center">
              <span>View Details</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </Link>
  );
}

// Helper function to get condition color
function getConditionColor(condition: string): string {
  switch (condition) {
    case "New":
      return "bg-green-100 text-green-800";
    case "Like New":
      return "bg-blue-100 text-blue-800";
    case "Good":
      return "bg-yellow-100 text-yellow-800";
    case "Fair":
      return "bg-orange-100 text-orange-800";
    case "Poor":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
// Market component
export default function Market() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
const { state } = useAuthContext();
  useEffect(() => {
    fetch("http://localhost:5050/api/products/iitkgp", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user?.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Transform API response to match Item structure

        const formattedItems = data.map((item: ApiResponseItem) => ({
          id: item._id,
          name: item.name,
          condition: mapCondition(item.condition),
          price: item.price,
          verified: true, // Assuming all items are verified (adjust logic if needed)
          description: item.description,
          image: item.images.length > 0 ? item.images[0] : "/default-image.jpg", // Use first image if available
        }));
        setItems(formattedItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [state.user?.token]);

  // Function to map condition numbers to human-readable text
  function mapCondition(condition: number) {
    switch (condition) {
      case 5:
        return "New";
      case 4:
        return "Like New";
      case 3:
        return "Good";
      case 2:
        return "Fair";
      case 1:
        return "Poor";
      default:
        return "Unknown";
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Category />
      </div>
      <div className="text-center mb-8 mt-10 z-10">
        <h1 className="text-4xl text-slate-800 font-semibold mb-2 ml-3">
          Featured for You
        </h1>
      </div>
      <main className="flex-1 bg-background py-8 px-6">
        <div className="w-[90%] mx-auto">
          {loading ? (
            <p className="text-center text-xl font-bold">Loading...</p>
          ) : items.length > 0 ? (
            <div className="flex flex-wrap gap-8">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-xl font-bold">No items available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
