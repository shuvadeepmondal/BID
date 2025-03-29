
//           >
//             <option value="">Select condition</option>
          //   <option value="1">🌟</option>
          //   <option value="2">🌟🌟</option>
          //   <option value="3">🌟🌟🌟</option>
          //   <option value="4">🌟🌟🌟🌟</option>
          //   <option value="5">🌟🌟🌟🌟🌟</option>
//           </select>

import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

interface FormData {
  name: string;
  category: string;
  price: string;
  condition: string;
  imageUrl: string;
  description: string;
  acceptsCrypto: boolean;
  walletAddress: string;
  tags: string;
}

export const AddForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    price: "",
    condition: "",
    imageUrl: "",
    description: "",
    acceptsCrypto: false,
    walletAddress: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });

    // Clear error for this field when user types
    if (errors[e.target.name as keyof FormData]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined,
      });
    }
  };

  const { state } = useAuthContext();

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Product Name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (
      !formData.price.trim() ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    )
      newErrors.price = "Valid price greater than 0 is required";
    if (!formData.condition.trim())
      newErrors.condition = "Condition is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.acceptsCrypto && !formData.walletAddress.trim())
      newErrors.walletAddress =
        "Wallet address is required when accepting crypto";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      setSubmitMessage({ type: "", text: "" });

      try {
        // Format the data to match the expected controller structure
        const productData = {
          name: formData.name,
          images: [formData.imageUrl], // Convert single URL to array as expected by the controller
          condition: formData.condition,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          acceptsCrypto: formData.acceptsCrypto,
          walletAddress: formData.acceptsCrypto
            ? formData.walletAddress
            : undefined,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag), // Convert comma-separated string to array
        };

        const response = await fetch("https://a249-2409-40e0-2e-b44a-c824-2c25-484b-4c70.ngrok-free.app/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add product");
        }

        await response.json();

        // Success
        setSubmitMessage({
          type: "success",
          text: "Product added successfully!",
        });

        // Reset form
        setFormData({
          name: "",
          category: "",
          price: "",
          condition: "",
          imageUrl: "",
          description: "",
          acceptsCrypto: false,
          walletAddress: "",
          tags: "",
        });
        
      } catch (error) {
        setSubmitMessage({
          type: "error",
          text:"Something went wrong. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      className="w-full bg-white shadow-md p-6 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      {submitMessage.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${submitMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {submitMessage.text}
        </div>
      )}

      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Product Name
          </label>
          <input
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.name ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
          )}
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.category ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.category}
            </p>
          )}
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="price"
          >
            Price ($)
          </label>
          <input
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.price ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-500 text-xs italic mt-1">{errors.price}</p>
          )}
        </div>

        <div className="w-full md:w-1/2 px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="condition"
          >
            Condition
          </label>
          <select
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.condition ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select condition</option>
            <option value="1">🌟</option>
            <option value="2">🌟🌟</option>
            <option value="3">🌟🌟🌟</option>
            <option value="4">🌟🌟🌟🌟</option>
            <option value="5">🌟🌟🌟🌟🌟</option>
          </select>
          {errors.condition && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.condition}
            </p>
          )}
        </div>

        <div className="w-full px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="imageUrl"
          >
            Image URL
          </label>
          <input
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.imageUrl ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.imageUrl}
            </p>
          )}
        </div>

        <div className="w-full px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="tags"
          >
            Tags
          </label>
          <input
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="vintage, rare, limited (comma separated)"
          />
          <p className="text-gray-600 text-xs mt-1">
            Enter comma-separated tags to help buyers find your product
          </p>
        </div>

        <div className="w-full px-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.description ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="w-full px-3 mb-3">
          <div className="flex items-center">
            <input
              id="acceptsCrypto"
              name="acceptsCrypto"
              type="checkbox"
              checked={formData.acceptsCrypto}
              onChange={handleChange}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="acceptsCrypto"
              className="ml-2 block text-sm text-gray-900"
            >
              Accept cryptocurrency as payment
            </label>
          </div>
        </div>

        {formData.acceptsCrypto && (
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
              htmlFor="walletAddress"
            >
              Crypto Wallet Address
            </label>
            <input
              className={`appearance-none block w-full bg-white text-gray-900 font-medium border ${errors.walletAddress ? "border-red-500" : "border-gray-400"} rounded-lg py-3 px-3 leading-tight focus:outline-none focus:border-indigo-500`}
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="Enter your wallet address"
            />
            {errors.walletAddress && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.walletAddress}
              </p>
            )}
          </div>
        )}

        <div className="w-full px-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`appearance-none block w-full bg-indigo-500 text-gray-100 font-bold rounded-lg py-3 px-3 leading-tight ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-600"} focus:outline-none transition duration-200`}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </div>
    </form>
  );
};