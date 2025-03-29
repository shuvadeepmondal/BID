import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { User , AttendanceDataa } from "../interfaces";

const UserAttendance: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [attendance, setAttendance] = useState<AttendanceDataa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { state } = useAuthContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(
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

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get<AttendanceDataa[]>(
        `${import.meta.env.VITE_API}/api/attendance/${selectedUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
        }
      );
      setAttendance(response.data);
      setShow(true);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <div className="h-[70vh]">
      <h1 className="text-2xl xl:text-3xl font-extrabold text-center text-indigo-400 ubuntu-bold mt-12">
        Manage Attendance
      </h1>
      { loading ? <Loading/> : <div className="flex w-[70%] flex-col sm:flex-row mx-auto justify-center gap-5 sm:gap-0 sm:justify-between items-center mt-10">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold">Select A User</h1>
          <select
            onChange={(e) => handleUserChange(e.target.value)}
            value={selectedUserId}
            className="border p-3 rounded-lg"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-indigo-500  rounded-md text-white text-center h-[50px] p-3"
          onClick={fetchAttendance}
          disabled={!selectedUserId}
        >
          Show Attendance
        </button>
      </div>}
      {show && (
        <div className="overflow-hidden mt-9">
          <table className="min-w-[60%] mx-auto text-left text-sm font-light text-surface ">
            <thead className="border-b border-neutral-200 font-medium ">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Date
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>
            {attendance.length !== 0 ? (
              <tbody>
                {attendance.map((entry) => (
                  <tr key={entry._id} className="border-b border-neutral-200 ">
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link to={`/userprofile/${entry._id}`}>{entry.date}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link to={`/userprofile/${entry._id}`}>
                        {entry.status}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <div className="ml-[100px] sm:ml-0 sm:absolute top-[50%] right-[50%] sm:right-[47%] ubuntu-bold text-xl mt-25 sm:mt-5 text-indigo-500">
                No Data
              </div>
            )}
          </table>
        </div>
      )}
    </div>
  );
};

export default UserAttendance;
