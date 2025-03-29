import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { AttendanceData } from "../interfaces";
import Loading from "./Loading";


const UserProfile = () => {
    const navigate = useNavigate();
  const { state } = useAuthContext();
  const { id } = useParams();
  const [user, setUser] = useState<AttendanceData>({
    status: "",
    userName: "",
    userEmail: "",
    date: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/api/attendance/user/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
          }
        );

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, state.user?.token, user.status]);

  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      const newStatus = user.status === "present" ? "absent" : "present";
      const response = await axios.put(
        `${import.meta.env.VITE_API}/api/attendance/change-status/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
        }
      );

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error changing status:", error);
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
     
     await axios.delete(
        `${import.meta.env.VITE_API}/api/attendance/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
        }
      );

      
      setLoading(false);
      navigate("/viewAttendance");
    } catch (error) {
      console.error("Error changing status:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-[60vh] mt-20">
      <div className="bg-white overflow-hidden rounded-lg ">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl font-bold leading-6 ubuntu-bold text-center text-gray-900">
            User <span className="text-indigo-500">Attendance</span>
          </h3>
        </div>
        {user && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-xl font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-xl text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.userName}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-xl font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-xl text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.userEmail}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-xl font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-xl text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.status}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-xl font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-xl text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.date}
                </dd>
              </div>
            </dl>
          </div>
        )}
        <div className="mt-6 px-4 py-5 flex-col sm:flex-row sm:px-6 text-center flex sm:justify-between justify-center gap-4 sm:gap-0 flex-wrap">
          <button
            onClick={handleChangeStatus}
            className="bg-indigo-500 p-2 rounded-md text-white text-center w-[130px]"
          >
            Change Status
          </button>
          <button
            onClick={handleDelete}
            className="bg-indigo-500 p-2 rounded-md text-white text-center w-[130px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
