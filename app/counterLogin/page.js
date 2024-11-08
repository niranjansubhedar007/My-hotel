"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  faEye,
  faEyeSlash,
  faUser,
  fawhatsapp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Login from "../login/page";

export default function CounterLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/counterLogin/login",
        { username, password }
      );
      // Handle successful login, save token to localStorage, redirect, etc.
      console.log(response.data);
      const token = response.data.token;

      localStorage.setItem("couponEmployeeAuthToken", token);
      setMessage("Login successful");
      router.push("/couponDashboard");
    } catch (error) {
      setMessage("Authentication failed");
    }
  };

  useEffect(() => {
    localStorage.removeItem("couponEmployeeAuthToken");
  }, []);
  const [isOrderEnabled, setIsOrderEnabled] = useState(true);

  const handleToggle = () => {
    const newIsOrderEnabled = !isOrderEnabled;
    setIsOrderEnabled(newIsOrderEnabled);
    localStorage.setItem("isOrderEnabled", newIsOrderEnabled.toString());
  };

  // useEffect(() => {

  //   const storedOrder = localStorage.getItem("isOrderEnabled");
  //   if (storedOrder !== null) {
  //     setIsOrderEnabled(storedOrder === "true");
  //   }
  // }, []);
  return (
    <>
      {isOrderEnabled ? (
        <>
        <label
          htmlFor="toggle"
          className="flex items-center cursor-pointer  absolute right-5 mt-10"
        >
          <div className="relative">
            <input
              type="checkbox"
              id="toggle"
              className="sr-only"
              checked={isOrderEnabled}
              onChange={handleToggle}
            />
            <div className="w-11 h-6 bg-blue-100 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full "></div>
            <div
              className={`absolute w-6 h-6 bg-blue-300 rounded-full shadow inset-y-0 -left-6 ${
                isOrderEnabled ? "translate-x-full" : "translate-x-0"
              }`}
            ></div>
          </div>
          <div className="ml-3 text-gray-700 font-medium">Counter Login</div>
        </label>
        <div className="min-h-screen flex items-center justify-center font-sans">
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm ">
           
            <div className="w-full p-3 lg:w-96 border-solid">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               
              </div>
              <p className="text-2xl text-gray-600 text-center font-bold">
                Counter Login
              </p>

              <div className="mt-4 relative">
                <label className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                  Username
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-4 block w-full appearance-none pr-10 text-sm md:text-base"
                  type="text"
                  value={username}
                  placeholder="Enter Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-gray-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-4 relative">
                <label className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                  Password
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-4 block w-full appearance-none pr-10 text-sm md:text-base"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                  <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Link
                  href="/forgotPassword"
                  className="text-sm md:text-sm text-blue-500 mr-2"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="flex justify-center mt-1">
                <button
                  className=" bg-blue-100 text-blue-600 hover:bg-blue-200 text-gray font-semibold p-2 px-4 rounded-full mt-3 lg:w-full mx-auto"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>

              {message && <p className="mt-4 text-red-500">{message}</p>}
          
            </div>
          </div>
        </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
