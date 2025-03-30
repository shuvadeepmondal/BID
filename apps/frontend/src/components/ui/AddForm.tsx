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
            .filter((tag) => tag),
        };

        const response = await fetch(
          `${import.meta.env.VITE_API}/api/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
            body: JSON.stringify(productData),
          }
        );

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
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Function to render star rating for conditions
  const renderStarLabel = (value: string) => {
    const stars = "🌟".repeat(parseInt(value));
    const labels: Record<string, string> = {
      "1": "Poor",
      "2": "Fair",
      "3": "Good",
      "4": "Very Good",
      "5": "Excellent",
    };

    return `${stars} - ${labels[value] || ""}`;
  };

  return (
    <form className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Add New Product</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Fill in the details to list your product
        </p>
      </div>

      {/* Form content */}
      <div className="p-6">
        {submitMessage.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              submitMessage.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {submitMessage.type === "success" ? (
                <svg
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium">{submitMessage.text}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="col-span-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Product Name
            </label>
            <input
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="col-span-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <div className="relative">
              <select
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.category
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150`}
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Price */}
          <div className="col-span-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="price"
            >
              Price (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                className={`w-full pl-8 pr-4 py-2.5 rounded-lg border ${
                  errors.price ? "border-red-500 bg-red-50" : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Condition */}
          <div className="col-span-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="condition"
            >
              Condition
            </label>
            <div className="relative">
              <select
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.condition
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150`}
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">{renderStarLabel("1")}</option>
                <option value="2">{renderStarLabel("2")}</option>
                <option value="3">{renderStarLabel("3")}</option>
                <option value="4">{renderStarLabel("4")}</option>
                <option value="5">{renderStarLabel("5")}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="col-span-full">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="imageUrl"
            >
              Image URL
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                URL
              </span>
              <input
                className={`flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg border ${
                  errors.imageUrl
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {errors.imageUrl ? (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Provide a direct link to your product image
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="col-span-full">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="vintage, rare, limited (comma separated)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter comma-separated tags to help buyers find your product
            </p>
          </div>

          {/* Description */}
          <div className="col-span-full">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Accept Crypto */}
          <div className="col-span-full">
            <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptsCrypto"
                    name="acceptsCrypto"
                    type="checkbox"
                    checked={formData.acceptsCrypto}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="acceptsCrypto"
                    className="font-medium text-gray-700"
                  >
                    Accept cryptocurrency as payment
                  </label>
                  <p className="text-gray-500 text-sm">
                    Enable this option if you want to accept cryptocurrency
                    payments for this product
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Address (conditionally rendered) */}
          {formData.acceptsCrypto && (
            <div className="col-span-full">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="walletAddress"
              >
                Crypto Wallet Address
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.walletAddress
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
                type="text"
                id="walletAddress"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="Enter your wallet address"
              />
              {errors.walletAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.walletAddress}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            } transition duration-150`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddForm;
