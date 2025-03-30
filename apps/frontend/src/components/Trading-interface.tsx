import { useState } from "react";

interface Item {
  id: number;
  name: string;
  value: number;
  image: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  inventory: Item[];
  offering: Item[];
}

interface TradeStatus {
  user1Ready: boolean;
  user2Ready: boolean;
  completed: boolean;
}

export default function TradingInterface() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "User ",
      avatar: "src/assets/react.svg",
      inventory: [
        { id: 1, name: "Java Book", value: 150, image: "src/assets/book.png" },
      ],
      offering: [],
    },
    {
      id: 2,
      name: "User",
      avatar: "src/assets/react.svg",
      inventory: [
        { id: 2, name: "Chemistry Book", value: 200, image: "src/assets/book2.png" },
      ],
      offering: [],
    },
  ]);

  const [tradeStatus, setTradeStatus] = useState<TradeStatus>({
    user1Ready: false,
    user2Ready: false,
    completed: false,
  });

  const updateUserTrade = (userId: number, itemId: number, addToOffering: boolean) => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === userId) {
          const newInventory = [...user.inventory];
          const newOffering = [...user.offering];
          const itemIndex = addToOffering
            ? newInventory.findIndex((item) => item.id === itemId)
            : newOffering.findIndex((item) => item.id === itemId);

          if (itemIndex !== -1) {
            const item = addToOffering ? newInventory.splice(itemIndex, 1)[0] : newOffering.splice(itemIndex, 1)[0];
            addToOffering ? newOffering.push(item) : newInventory.push(item);
          }

          return { ...user, inventory: newInventory, offering: newOffering };
        }
        return user;
      });
    });

    setTradeStatus({ user1Ready: false, user2Ready: false, completed: false });
  };

  const toggleReady = (userId: number) => {
    setTradeStatus((prevStatus) => ({
      ...prevStatus,
      [userId === 1 ? "user1Ready" : "user2Ready"]: !prevStatus[userId === 1 ? "user1Ready" : "user2Ready"],
    }));
  };

  const completeTrade = () => {
    if (tradeStatus.user1Ready && tradeStatus.user2Ready) {
      setUsers(([user1, user2]) => [
        { ...user1, inventory: [...user1.inventory, ...user2.offering], offering: [] },
        { ...user2, inventory: [...user2.inventory, ...user1.offering], offering: [] },
      ]);

      setTradeStatus({ user1Ready: false, user2Ready: false, completed: true });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-10xl mx-auto bg-white rounded-xl p-10">
        <div className=" p-4 text-center font-bold text-3xl">Trading Interface</div>
        {tradeStatus.completed ? (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Trade Completed!</h2>
            <button onClick={() => setTradeStatus({ user1Ready: false, user2Ready: false, completed: false })} className="bg-blue-600 text-white px-4 py-2 rounded">New Trade</button>
          </div>
        ) : (
          <div className="text-center justify-center flex  flex-col ml-10 gap-[10rem] md:flex-row">
            {users.map((user) => (
              <div key={user.id} className="w-full md:w-1/3 p-4 border-gray-700 shadow-xl rounded-2xl">
                <div className="flex items-center mb-4">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                  <h2 className="text-xl font-bold">{user.name}</h2>
                </div>
                <h3 className="text-lg font-semibold mb-2">Trading Inventory</h3>
                <div className="grid grid-cols-2 gap-2">
                  {user.inventory.map((item) => (
                    <div key={item.id} className="border  p-2 justify-center cursor-pointer hover:bg-gray-100" onClick={() => updateUserTrade(user.id, item.id, true)}>
                      <img src={item.image} alt={item.name} className="w-16 h-16 mb-2 rounded-xl ml-14 " />
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs">Value: {item.value}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Offering</h3>
                <div className="bg-gray-50 p-3 rounded-lg min-h-32">
                  {user.offering.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No items added</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-5 ">
                      {user.offering.map((item) => (
                        <div key={item.id} className="border p-2 cursor-pointer hover:bg-gray-50" onClick={() => updateUserTrade(user.id, item.id, false)}>
                          <img src={item.image} alt={item.name} className="w-16 h-16 mb-2" />
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs">Value: {item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => toggleReady(user.id)} className={`mt-2 px-4 py-2 rounded ${tradeStatus[user.id === 1 ? "user1Ready" : "user2Ready"] ? "bg-indigo-500 text-white" : "bg-gray-200"}`}>{tradeStatus[user.id === 1 ? "user1Ready" : "user2Ready"] ? "Ready ✓" : "Ready?"}</button>
              </div>
            ))}
          </div>
        )}
        {!tradeStatus.completed && (
          <div className="text-center mt-6 ml-12">
            <button onClick={completeTrade} disabled={!tradeStatus.user1Ready || !tradeStatus.user2Ready} className={`px-6 py-3 rounded-lg font-bold ${tradeStatus.user1Ready && tradeStatus.user2Ready ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Complete Trade</button>
          </div>
        )}
      </div>
    </div>
  );
}
