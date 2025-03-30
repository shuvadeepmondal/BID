import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AddForm } from "./ui/AddForm";
import { useAuthContext } from "../hooks/useAuthContext";

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
  status: string;
  createdAt: string;
}

const AddProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { state } = useAuthContext();

  useEffect(() => {
    if (!state.user?.token) return;

    fetch(`${import.meta.env.VITE_API}/api/products/iitkgp/my-products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [state.user?.token]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-[600px] h-[600px] bg-blue-200/20 rounded-full absolute -top-40 -left-40 blur-3xl" />
        <div className="w-[400px] h-[400px] bg-purple-200/20 rounded-full absolute bottom-0 right-0 blur-3xl" />
      </div>

      {/* Header */}
      <div className="py-5 mx-auto w-[86%] border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          My <span className="text-indigo-600">Spaces</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and track all my items
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Add Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <AddForm />
          </div>
        </div>

        {/* Products Table Section */}
        <div className="lg:col-span-2">
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
                              product.images[0] ||
                              "https://via.placeholder.com/50"
                            }
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded-md shadow-sm"
                          />
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {product.name}
                        </td>
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
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No products found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Add some products to get started!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
