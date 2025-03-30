import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

interface Product {
  _id: string;
  name: string;
  images?: string[]; // Made optional to prevent errors
  condition: number;
  description: string;
  category: string;
  price: number;
  acceptsCrypto: boolean;
  walletAddress?: string;
  status: string;
  createdAt: string;
}

const AddProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuthContext();

  useEffect(() => {
    if (!state.user?.token) {
      setError("You must be logged in to view products.");
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API}/api/products/iitkgp/my-products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch products. Please check your session."
          );
        }
        return response.json();
      })
      .then((data: Product[]) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response.");
        }
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state.user?.token]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading products...</p>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <img
          src="/empty.jpg" // Replace with a proper "no items" illustration
          alt="No Items"
          className="mb-4 w-[20rem] h-[20rem]"
        />
        <h2 className="text-2xl font-semibold text-gray-800">
          You don't have any items in your space!
        </h2>
        <p className="text-gray-500 mt-2">Start by adding a new product.</p>
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <img
          src="https://via.placeholder.com/150" // Replace with a proper "no items" illustration
          alt="No Items"
          className="mb-4 w-32 h-32"
        />
        <h2 className="text-2xl font-semibold text-gray-800">
          You don't have any items in your space!
        </h2>
        <p className="text-gray-500 mt-2">Start by adding a new product.</p>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      {/* Header */}
      <div className="py-5 mx-auto w-[86%] border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          My <span className="text-indigo-600">Spaces</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and track all my items
        </p>
      </div>

      <div className="w-[85vw] mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Products
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-center">Condition</th>
                    <th className="py-3 px-4 text-center">Crypto</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {products.map((product, index) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">{index + 1}</td>
                      <td className="py-4 px-4">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/50"
                          }
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded-md shadow-sm"
                        />
                      </td>
                      <td className="py-4 px-4 font-medium">{product.name}</td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-green-600">
                        ${product.price}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800">
                          {product.condition}/5
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            product.acceptsCrypto
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.acceptsCrypto ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
