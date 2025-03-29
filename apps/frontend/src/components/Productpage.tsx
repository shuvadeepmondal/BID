import { useState } from "react"
import { ChevronLeft, ChevronRight, Heart, Info, Maximize, ZapIcon } from "lucide-react"

export default function ProductPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [
    "src/assets/book.png?height=500&width=500",
    "src/assets/book2.png?height=500&width=500",
    "src/assets/engd.png?height=500&width=500",
    "src/assets/hard.png?height=500&width=500",
    "src/assets/book.png?height=500&width=500",
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 mt-10">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column - Images */}
        <div className="md:col-span-7">
          <div className="relative">
            {/* Main Image */}
            <div className="border bg-gray-100 relative">
              <div className="relative h-[500px] w-full">
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="Product photo"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md">
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="bg-white/80 rounded-full p-1 shadow-md">
                  <Maximize className="h-5 w-5" />
                </button>
                <button className="bg-white/80 rounded-full p-1 shadow-md">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`border ${index === currentImageIndex ? "border-blue-500" : "border-gray-300"} p-1`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <div className="relative h-20 w-full">
                    <img
                      src={img || "src/assets/book.png"}
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
          <h1 className="text-2xl font-bold mb-4">
            Java Book Authored by Pujan Sutradhar
          </h1>

          {/* Seller Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-sm"></div>
            <div>
              <div className="flex items-center gap-1">
                <span>tuman sarkar</span>
                <span className="text-gray-500">(271)</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                  100% positive
                </a>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <a href="#" className="text-blue-600 hover:underline">
                  Seller's other items
                </a>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <a href="#" className="text-blue-600 hover:underline">
                  Contact seller
                </a>
              </div>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-2xl font-bold">INR 100</div>
            <div className="text-sm text-gray-600">or Best Offer</div>
          </div>

          <hr className="my-4" />

          {/* Condition */}
          <div className="flex items-center gap-2 mb-6">
            <div className="font-medium">Condition:</div>
            <div>New without tags</div>
            <Info className="h-4 w-4 text-gray-500" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-lg">
              Buy It Now
            </button>
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-full">
              Add to cart
            </button>
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-full">
              Make offer
            </button>
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 mr-2" />
              Add to Watchlist
            </button>
          </div>

          {/* Watchlist Info */}
          <div className="flex items-center gap-2 mt-4 bg-gray-50 p-3 rounded-md">
            <ZapIcon className="h-5 w-5 text-gray-700" />
            <div className="text-sm">
              People are checking this out. <span className="font-medium">6 have added this to their watchlist.</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 space-y-3">

            <div className="flex flex-col sm:flex-row">
              <div className="w-24 text-gray-600 mb-1 sm:mb-0">Delivery:</div>
              <div>
                <div className="flex flex-wrap items-center gap-1">
                  <div className=" text-white text-xl p-1">
                    <span>📦</span>
                  </div>
                  <span>Estimated between Tomorrow, Mar 31 and Mon </span>
                  <Info className="h-4 w-4 text-gray-500" />
                </div>
                <div className="text-sm mt-1">
                  Please note the delivery estimate is{" "}
                  <span className="font-medium">Order within 10 min.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row">
              <div className="w-24 text-gray-600 mb-1 sm:mb-0">Returns:</div>
              <div className="text-sm">2 days returns. Buyer pays for return shipping. If you use avalanche</div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Similar Items</h2>
          <a href="#" className="text-blue-600 hover:underline">
            See all
          </a>
        </div>
        <div className="text-xs text-gray-500 mb-2">Sponsored</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded-md overflow-hidden relative">
              <button className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1 shadow-sm">
                <Heart className="h-4 w-4" />
              </button>
              <div className="relative h-48 w-full">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt={`Similar item ${item}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

