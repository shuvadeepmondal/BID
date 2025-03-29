import { useState, useEffect } from "react";
import axios from "axios";
import { FaHandPaper } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import Admin from "./Admin";
import Loading from "./Loading";
import { AttendanceCountData } from "../interfaces";

const Home = () => {
  const { state } = useAuthContext();
  const [atDone , setAtDone] = useState<boolean>(false);
  const [error , seterror] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] =
    useState<AttendanceCountData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
  const getMessage = () => {
    setAtDone(true);

    setTimeout(() => {
      setAtDone(false);
    }, 3000); 
  };
  const getError = () => {
    seterror(true);

    setTimeout(() => {
      seterror(false);
    }, 3000); 
  };
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/api/attendance/counts/${state.user?.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
          }
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [state.user?.id, state.user?.token , atDone]);
  
   const handleAttendance = async (status: "present" | "absent") => {
    const userId = state.user?.id;
     try {
       await axios.post(
         `${import.meta.env.VITE_API}/api/attendance`,{ userId, status },
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${state.user?.token}`,
           },
         }
       );
       getMessage();
     } catch (error) {
       console.error("Error recording attendance:", error);
       getError();
     }
   };

  if (state.user?.role === `${import.meta.env.VITE_ROLE}`) {
    return <Admin />;
  }

  
  return (
    <div className="pt-[3.25rem] px-[3rem] flex flex-col gap-[3rem] ubuntu-bold h-[70vh]">
      <div className="flex flex-col gap-[50px]">
        <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-indigo-400 rounded-[100%] top-[50%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center ">
            Your <span className="text-indigo-500">Attendence</span>
          </h1>
        </div>

        {loading ? <Loading/> :(<div className="flex flex-col gap-10 justify-center">
          <div className="flex justify-center  w-[86%] mx-auto  gap-6 sm:gap-10">
            <div>
              <h1 className="font-bold">Total Present</h1>
              <div className="border-2  border-green-500 h-[100px] sm:h-[120px] w-[170px] sm:w-[200px]  shadow-lg rounded-lg flex justify-center items-center text-black mt-2 text-2xl">
                {attendanceData?.presentDays} days
              </div>
            </div>
            <div>
              <h1 className="font-bold">Total Absent</h1>
              <div className="border-2  border-rose-500 h-[100px] sm:h-[120px]  w-[170px] sm:w-[200px] shadow-lg rounded-lg flex justify-center items-center text-black mt-2 text-2xl">
                {attendanceData?.absentDays} days
              </div>
            </div>
          </div>

          <button
            className="px-3 py-3 bg-indigo-500 rounded-xl w-[86%] sm:w-[31%] mx-auto text-white ubuntu-medium flex justify-center items-center gap-3 hover:bg-indigo-400"
            onClick={() => handleAttendance("present")}
          >
            <FaHandPaper />
            Give Today's Attendance
          </button>
          {atDone && (
            <h1 className="p-3 ubuntu-light bg-green-300 text-green-600 rounded-lg w-[86%] sm:w-[31%] mx-auto text-center">
              Attendance Done!
            </h1>
          )}
          {error && (
            <h1 className="p-3 ubuntu-light bg-rose-300 text-rose-600 rounded-lg w-[86%] sm:w-[31%] mx-auto text-center">
              Attendance Already Done!
            </h1>
          )}
        </div>)}
      </div>
    </div>
  );
};

export default Home;
