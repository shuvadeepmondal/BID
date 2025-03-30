import React from "react";

const categories = [
  { id: 1, name: "Books", image: "src/assets/book2.png" },
  { id: 2, name: "Technical", image: "src/assets/tech.png" },
  { id: 3, name: "Eng. Tools", image: "src/assets/engd.png" },
  { id: 4, name: "Hardware", image: "src/assets/hard.png" },
];

const Category: React.FC = () => {
  return (
    <div className="py-10">
      <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-indigo-400 rounded-[100%] top-[50%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
      <h2 className="text-4xl font-bold text-center mb-6">Our <span className="text-blue-500">Categories</span></h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-3xl shadow-xl text-center hover:shadow-2xl transition"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-24 h-24 object-cover rounded-full mb-2 mx-auto"
            />
            <h3 className="text-lg font-medium">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;