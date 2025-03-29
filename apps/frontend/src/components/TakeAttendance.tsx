import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../interfaces";
import { useAuthContext } from "../hooks/useAuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TakeAttendance: React.FC = () => {
  const { state } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  const [attendanceData, setAttendanceData] = useState<
    { userId: string; status: string }[]
  >([]);

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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [state.user?.token]);

const handleCheckboxChange = (userId: string) => {
  setAttendanceData((prevAttendanceData) => {
    const index = prevAttendanceData.findIndex(
      (data) => data.userId === userId
    );
    if (index !== -1) {
      const updatedData = [...prevAttendanceData];
      updatedData.splice(index, 1);
      return updatedData;
    } else {
      return [...prevAttendanceData, { userId, status: "present" }];
    }
  });
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const absentUsers = users
    .filter((user) => !attendanceData.some((data) => data.userId === user._id))
    .map((user) => ({ userId: user._id, status: "absent" }));
  try {
    await axios.post(
      `${import.meta.env.VITE_API}/api/attendance/all`,
      {
        date: selectedDate,
        attendanceData: [...attendanceData, ...absentUsers],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.user?.token}`,
        },
      }
    );
    handleSuccess();
  } catch (error) {
    console.error("Error submitting attendance:", error);
    handleError();
  }
};

  return (
    <div className="min-h-[70vh]  w-[80%] mx-auto">
      <h2 className="text-2xl font-bold leading-6 ubuntu-bold text-center text-gray-900 mt-[40px]">
        Attendance <span className="text-indigo-500">Form</span>
      </h2>
      <form
        className="flex justify-center items-center flex-col gap-[50px]"
        onSubmit={handleSubmit}
      >
        <div className="mt-[50px] flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-20">
          <label className="ubuntu-medium">
            Enter Date - <br />{" "}
            <span className="text-sm ubuntu-light text-indigo-400">
              Select Check box for Attendance
            </span>
          </label>
          <DatePicker
            className="border-2 border-gray-600 w-[200px] rounded-md text-center p-1 "
            selected={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="">
            {users.map((user) => (
              <tr key={user._id} className="bg-white border-b">
                <td className="px-3 sm:px-6 py-2 sm:py-4">{user.name}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4">{user.email}</td>
                <td className="px-3 sm:px-6 py-2 sm:py-4">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(user._id)}
                    checked={attendanceData.some(
                      (data) => data.userId === user._id
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-indigo-500  rounded-md text-white text-center h-[50px] p-3"
          type="submit"
        >
          Submit Attendance
        </button>
        {mark && (
          <h1 className="p-3 bg-green-300 rounded-lg mx-auto mt-[-30px]  w-[275px]">
            Attendance submitted successfully!
          </h1>
        )}
        {markEr && (
          <h1 className="p-3 bg-green-300 rounded-lg mx-auto mt-[-30px]  w-[275px]">
            Attendance Failed!
          </h1>
        )}
      </form>
    </div>
  );
};

export default TakeAttendance;
