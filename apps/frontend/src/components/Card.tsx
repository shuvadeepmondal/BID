import Category from "./Category";

// Define the type for an item
interface Item {
  id: number;
  name: string;
  condition: string;
  price: number;
  verified: boolean;
  description: string;
  image: string;
}

// Props for the ItemCard component
interface ItemCardProps {
  item: Item;
}

function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-xl hover:shadow-2xl relative">
      {item.verified && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          Verified Product
        </span>
      )}
      <img
        src={item.image}
        alt={item.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
        style={{ aspectRatio: "200/300" }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{item.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-muted-foreground">
            Condition: {item.condition}
          </span>
          <span className="text-lg font-bold">${item.price}</span>
        </div>
        <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
          View Details
        </button>
      </div>
    </div>
  );
}

export default function Market() {
  const items: Item[] = [
    {
      id: 1,
      name: "Java Book",
      condition: "Good",
      price: 25,
      verified: true,
      description: "Authored by Pujan Sutradhar",
      image: "src/assets/book.png",
    },
    {
      id: 2,
      name: "Smartphone Battery",
      condition: "Refurbished",
      price: 12,
      verified: false,
      description: "Refurbished smartphone battery, 80% capacity.",
      image: "/images/jane-smith.jpg",
    },
    {
      id: 3,
      name: "Desktop RAM",
      condition: "Used",
      price: 20,
      verified: true,
      description: "Used desktop RAM, 8GB DDR4.",
      image: "/images/alice-brown.jpg",
    },
    {
      id: 4,
      name: "Printer Cartridge",
      condition: "Refurbished",
      price: 15,
      verified: false,
      description: "Refurbished printer cartridge, compatible with most models.",
      image: "/images/bob-green.jpg",
    },
    {
      id: 5,
      name: "Keyboard",
      condition: "Used",
      price: 10,
      verified: false,
      description: "Used keyboard in good working condition.",
      image: "/images/charlie-white.jpg",
    },
    {
      id: 6,
      name: "Mouse",
      condition: "Refurbished",
      price: 8,
      verified: true,
      description: "Refurbished wireless mouse, works great.",
      image: "/images/diana-black.jpg",
    },
    {
      id: 7,
      name: "Hard Drive",
      condition: "Used",
      price: 30,
      verified: true,
      description: "Used 1TB hard drive, tested and working.",
      image: "/images/eve-blue.jpg",
    },
    {
      id: 8,
      name: "Tablet Screen",
      condition: "Refurbished",
      price: 40,
      verified: false,
      description: "Refurbished tablet screen, compatible with various models.",
      image: "/images/frank-yellow.jpg",
    },
  ];

  return (

    <div className="flex flex-col min-h-screen">
        <div>
          <Category/>
        </div>
           <div className="text-center mb-8 mt-10 z-10">
              <h1 className="text-4xl text-slate-800 font-semibold mb-2 ml-3">
                Featured for You
              </h1>
            </div>
        <main className="flex-1 bg-background py-8 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </main>
    </div>
  );
}
