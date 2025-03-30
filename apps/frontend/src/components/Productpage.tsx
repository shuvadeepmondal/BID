import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
} from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";

// Define the product data type
interface Product {
  _id: string;
  name: string;
  images: string[];
  condition: number;
  description: string;
  category: string;
  price: number;
  acceptsCrypto: boolean;
  walletAddress: string;
  user: string;
  campus: string;
  status: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}


export default function ProductPage() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { state } = useAuthContext();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/products/iitkgp/items/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Images */}
        <div className="md:col-span-7">
          <div className="relative">
            <div className="border bg-gray-100 relative">
              <div className="relative h-[500px] w-full">
                <img
                  src={
                    product.images?.[currentImageIndex] || "/placeholder.svg"
                  }
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              {/* Image Navigation */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                onClick={() =>
                  setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    Math.min(prev + 1, product.images.length - 1)
                  )
                }
                disabled={currentImageIndex === product.images.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  className={`border ${index === currentImageIndex ? "border-blue-500" : "border-gray-300"} p-1`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <div className="relative h-20 w-full">
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="md:col-span-5">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

          {/* Seller Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-sm"></div>
            <div>
              <div className="flex items-center gap-1">
                <span>{product.user || "Unknown Seller"}</span>
                <span className="text-gray-500">(271)</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-2xl font-bold">INR {product.price}</div>
            {product.acceptsCrypto && (
              <div className="text-sm text-green-600">Accepts Crypto</div>
            )}
          </div>

          <hr className="my-4" />

          {/* Condition */}
          <div className="flex items-center gap-2 mb-6">
            <div className="font-medium">Condition:</div>
            <div>{product.condition || "Not specified"}</div>
            <Info className="h-4 w-4 text-gray-500" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-lg">
              Buy It Now
            </button>
            <Link to = "/mycard">
            <button  className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-full">
              Add to cart
            </button>
            </Link>
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-full">
              Make offer
            </button>
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 mr-2" />
              Add to Watchlist
            </button>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row">
              <div className="w-24 text-gray-600 mb-1 sm:mb-0">Delivery:</div>
              <div className="text-sm">
                Estimated between <strong>Tomorrow</strong> and{" "}
                <strong>Monday</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
