import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AddForm } from "./ui/AddForm";
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

const AddProducts = () => {
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
      <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-indigo-400 rounded-[100%] top-[80%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
      <h1 className="font-bold my-10 text-4xl justify-center text-center">Your <span className="text-blue-600">Space</span></h1>
      <div className="flex flex-col mx-3 mt-6 lg:flex-row">
        <div className="w-full lg:w-1/3 m-1">
          <AddForm />
        </div>
        <div className="w-full lg:w-2/3 m-1  shadow-lg text-lg rounded-2xl border border-gray-400 ">
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

export default AddProducts;
