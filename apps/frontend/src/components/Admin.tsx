import axios from "axios";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Loading from "./Loading";
import { User } from "../interfaces";

const Admin = () => {
  const { state } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [mark, setMark] = useState<boolean>(false);
  const [markEr, setMarkEr] = useState<boolean>(false);
  const handleSuccess = async () => {
    setMark(true);
    setTimeout(() => {
      setMark(false);
    }, 5000);
  };
  const handleError = async () => {
    setMarkEr(true);
    setTimeout(() => {
      setMarkEr(false);
    }, 5000);
  };

  const handleClick = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/attendance/mark-absent`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
        }
      );
      handleSuccess();
    } catch (error) {
      console.error("Error marking users as absent:", error);
      handleError();
    }
  };
  const [userss, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/api/users`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [state.user?.token]);

  return (
    <div className="h-[70vh] text-center flex flex-col gap-6">
      <div>
        <h1 className="text-2xl xl:text-3xl font-extrabold text-indigo-400 ubuntu-bold mt-12">
          All Users ({userss.length})
        </h1>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="sm:w-[40%] mx-auto max-h-[400px] overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {userss.map((user, index) => (
              <div
                key={index}
                className="flex justify-center items-center py-4 px-6"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {index + 1}.
                </h3>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-base">{user.email}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleClick}
        className="bg-indigo-500 hover:bg-indigo-400 p-2 rounded-md text-white text-center mx-auto  w-[190px]"
      >
        Mark All Absent Users
      </button>
      {mark && (
        <h1 className="p-2 bg-green-300 rounded-lg mx-auto  w-[350px]">
          Attendance marked as absent for users who did not give attendance.
        </h1>
      )}
      {markEr && (
        <h1 className="p-2 bg-red-300 rounded-lg mx-auto  w-[350px]">
          Unable to mark attendance
        </h1>
      )}
    </div>
  );
};

export default Admin;
