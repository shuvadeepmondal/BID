import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

// Define the Product type
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

const OffersPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { state } = useAuthContext();

  useEffect(() => {
    if (!state.user?.token) return; // Prevent fetching if no user is logged in

    fetch(`${import.meta.env.VITE_API}/api/products/iitkgp/my-products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data: Product[]) => {
        console.log("Parsed response:", data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [state.user?.token]);

  return (
    <div className="w-[95%] mx-auto">
      <div className="header my-3 h-12 px-10 flex items-center justify-between">
        <h1 className="font-medium text-2xl">All Categories</h1>
      </div>
      <div className="flex flex-col mx-3 mt-6 lg:flex-row">
        <div className="w-full lg:w-1/3 m-1">
          <div className="border w-full h-[25rem] p-4 mb-2 shadow-lg space-y-4*">
            <div className="w-[95%] mx-auto border h-[3rem] rounded-lg">
              <h1>Offer Req</h1>
            </div>
            <div className="w-[95%] mx-auto border h-[3rem] rounded-lg">
              <h1>Offer Req</h1>
            </div>
            <div className="w-[95%] mx-auto border h-[3rem] rounded-lg">
              <h1>Offer Req</h1>
            </div>
            <div className="w-[95%] mx-auto border h-[3rem] rounded-lg">
              <h1>Offer Req</h1>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3 m-1 bg-white shadow-lg text-lg rounded-sm border border-gray-200">
          <div className="overflow-x-auto rounded-lg p-3">
            <table className="table-auto w-full">
              <thead className="text-sm font-semibold uppercase text-gray-800 bg-gray-50">
                <tr>
                  <th></th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Crypto?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      <img
                        src={
                          product.images[0] || "https://via.placeholder.com/50"
                        }
                        alt={product.name}
                        className="h-8 w-8 mx-auto rounded"
                      />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.description}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">${product.price}</td>
                    <td className="p-2 text-center">{product.condition}/5</td>
                    <td className="p-2 text-center">
                      {product.acceptsCrypto ? "Yes" : "No"}
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button className="rounded-md hover:bg-green-100 text-green-600 p-2 flex items-center">
                          <FaEdit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button className="rounded-md hover:bg-red-100 text-red-600 p-2 flex items-center">
                          <FaTrash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
