import { useState } from "react";

// Define the item type
interface CartItemType {
  id: string;
  name: string;
  condition: string;
  category: string;
  tag: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="md:flex items-stretch py-8 md:py-10 lg:py-8 border-t border-gray-50">
      <div className="md:w-4/12 2xl:w-1/4 w-full">
        <img src={item.image} alt={item.name} className="h-full object-center object-cover md:block hidden" />
      </div>
      <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
        <p className="text-xs leading-3 text-gray-800 md:pt-0 pt-4">{item.id}</p>
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-black leading-none text-gray-800">{item.name}</p>
          <select
            aria-label="Select quantity"
            className="py-2 px-1 border border-gray-200 mr-6 focus:outline-none"
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs leading-3 text-gray-600 pt-2">{item.condition}</p>
        <p className="text-xs leading-3 text-gray-600 py-4">{item.category}</p>
        <p className="w-96 text-xs leading-3 text-gray-600">{item.tag}</p>
        <div className="flex items-center justify-between pt-5">
          <div className="flex items-center">
            <p className="text-xs leading-3 underline text-gray-800 cursor-pointer">Add to favorites</p>
            <p className="text-xs leading-3 underline text-red-500 pl-5 cursor-pointer" onClick={() => onRemove(item.id)}>
              Remove
            </p>
          </div>
          <p className="text-base font-black leading-none text-gray-800">₹{item.price * item.quantity}</p>
        </div>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItemType[]>([
    {
      id: "01",
      name: "Book",
      condition: "⭐⭐⭐⭐",
      category: "book",
      tag: "vintage",
      price: 200,
      quantity: 1,
      image: "src/assets/book.png",
    },
    {
      id: "02",
      name: "PC",
      condition: "⭐⭐⭐",
      category: "Electronics",
      tag: "rare",
      price: 250,
      quantity: 1,
      image: "src/assets/tech.png",
    },
  ]);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto mt-10">
      <div className="sm:flex shadow-md my-10">
        <div className="w-full sm:w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{items.length} Items</h2>
          </div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} onQuantityChange={handleQuantityChange} />
          ))}
          <a href="#" className="flex font-semibold text-indigo-600 text-sm mt-10">
            <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Continue Shopping
          </a>
        </div>
        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
          <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Items {items.length}</span>
            <span className="font-semibold text-sm">₹{subtotal}</span>
          </div>
          <div>
            <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
            <select className="block p-2 text-gray-600 w-full text-sm">
              <option>Standard Platform fees - ₹{shipping}</option>
            </select>
          </div>
          <div className="py-10">
            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">
              Promo id
            </label>
            <input type="text" id="promo" placeholder="Enter your id" className="p-2 text-sm w-full" />
          </div>
          <button className="bg-slate-800 hover:bg-slate-600 rounded-2xl px-5 py-2 text-sm text-white uppercase">
            Apply
          </button>
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>₹{total}</span>
            </div>
            <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
