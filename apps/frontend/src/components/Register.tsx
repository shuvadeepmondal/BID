import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { RegisterFormData } from "../interfaces";
import { useRegister } from "../hooks/useRegister";


const Register = () => {
  const { register, error, isLoading, isSucess } = useRegister();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    admissionYear: "",
    department: "",
    course: "",
  });

  const { name, email, password, phone, admissionYear, department, course } = formData;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit =async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    await register(formData);
  };

  return (
    <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 sm:w-[60%] sm:mx-auto ">
      <div className="mt-12 flex flex-col items-center">
        <h1 className="text-2xl xl:text-3xl font-extrabold text-indigo-400 ubuntu-bold">
          Register
        </h1>
      
        {error && (
          <div className="w-full max-w-xs p-4 mb-4 text-red-800 bg-red-100 border border-red-400 rounded-lg shadow-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isSucess && (
          <div className="w-full max-w-xs p-4 mb-4 text-green-800 bg-green-100 border border-green-400 rounded-lg shadow-md">
            🎉 Registration Successful!
          </div>
        )}

        <div className="w-full flex-1 mt-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="Name"
                autoComplete="user-name"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="Email"
                autoComplete="email"
              />
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="Phone no."
                autoComplete="phone_no"
              />
              <input
                type="number"
                name="admissionYear"
                value={admissionYear}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="admissionYear"
                autoComplete="admissionYear"
              />
              <input
                type="text"
                name="course"
                value={course}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="course"
                autoComplete="course"
              />
              <input
                type="text"
                name="department"
                value={department}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="department"
                autoComplete="department"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              Register
            </button>
            {error && (
              <div className="bg-rose-200 text-rose-500 p-5 rounded-lg mt-4">
                Invalid credentials
              </div>
            )}
            {isSucess && (
              <div className="bg-green-200 text-green-500 p-5 rounded-lg mt-4">
                Register Done!
              </div>
            )}
            <p className="mt-6 text-xs text-gray-600 text-center">
              Already have an account?
              <Link
                to="/login"
                className="border-b text-indigo-400 border-gray-500 border-dotted"
              >
                {" "}
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
