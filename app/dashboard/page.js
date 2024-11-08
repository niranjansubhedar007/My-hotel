// "use client";
// import { useRouter } from "next/navigation";
// import { faBellConcierge, faSignOutAlt, faFileLines } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Link from "next/link";
// import Image from "next/image";
// import axios from 'axios';

// const Dashboard = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const authToken = localStorage.getItem("EmployeeAuthToken");
//     if (!authToken) {
//       router.push("/login");
//     }
//   }, []);

//   const handleLogout = async () => {
//     await axios.post('http://localhost:5000/api/liquorBrand/updateClosing');

//     localStorage.removeItem("EmployeeAuthToken");
//     router.push("/login");
//   };

//   return (
//     <>
//       <Navbar />
//       <div>
//         <section className="text-gray-600 body-font m-5 p-5 font-sans relative">
//           <div className="flex flex-col sm:flex-row justify-between items-center  md:fixed lg:fixed fixed ml-3 ">
//             {/* Add your image here for tablets and larger screens */}
//             <div className="sm:w-1/2 sm:mr-5 sm:mb-0 hidden md:block bg-cover text-center lg:mt-7 ">
//               <Image src="/amico.png" alt="logo" height={430} width={420} />
//               <div>
//                 <footer className=" text-xs md:text-sm lg:text-sm lg:pr-16 lg:mt-2 md:mt-1 whitespace-nowrap">
//                   &copy; AB Software Solution. All Rights Reserved.
//                 </footer>
//                 <footer className=" text-xs md:text-sm lg:text-sm lg:pr-16">
//                   Call Us: 7083570386 / 8888732973
//                 </footer>
//                 <footer className=" text-xs md:text-sm lg:text-sm lg:pr-16">
//                   Technical Support: 9699810037
//                 </footer>
//               </div>
//             </div>

//             <div className="lg:ml-10">
//               <div className="sm:w-1/2">
//                 <div className=" px-5 py-20 mx-auto ">
//                   <div className="mx-auto">
//                     <div className="lg:flex">
//                       <div className="sm:w-1/2 md:w-full sm:h-1/2 p-4 md:ml-10 lg:mr-4">
//                         <Link href="/order">
//                           <div className="relative h-32 rounded-md overflow-hidden bg-gray-200 border-2 flex flex-col items-center justify-center text-center lg:w-56 md:w-48 w-48 hover:bg-gray-100 hover:border-gray-400">
//                             <div className="bg-violet-300 p-3.5 px-5 rounded-full border-2">
//                               <FontAwesomeIcon
//                                 icon={faBellConcierge}
//                                 size="2xl"
//                                 color="blue"
//                               />
//                             </div>
//                             <div className="mt-4">
//                               <h3 className="text-gray-900 font-semibold mb-1 text-base">
//                                 Order
//                               </h3>
//                             </div>
//                           </div>
//                         </Link>
//                       </div>
//                       <div className="sm:w-1/2 md:w-full sm:h-1/2 p-4 md:ml-10">
//                         <Link href="/reportLogin">
//                           <div className="relative h-32 rounded-md overflow-hidden bg-gray-200 border-2 flex flex-col items-center justify-center text-center lg:w-56 md:w-48 w-48 hover:bg-gray-100 hover:border-gray-400">
//                             <div className="bg-violet-300 p-3 px-6 rounded-full border-2">
//                               <FontAwesomeIcon
//                                 icon={faFileLines}
//                                 size="2xl"
//                                 color="blue"
//                               />
//                             </div>
//                             <div className="mt-4">
//                               <h3 className="text-gray-900 font-semibold mb-1 text-base">
//                                 Reports
//                               </h3>
//                             </div>
//                           </div>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Add your logout button here */}
//         <div className="fixed bottom-3 right-4 z-30 fony-sans">
//           <button
//             onClick={handleLogout}
//             className="bg-red-200 hover:bg-red-300 text-red-700 py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline-red font-bold text-base"
//           >
//             <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Dashboard;

"use client";

import { useRouter } from "next/navigation";
import {
  faBellConcierge,
  faSignOutAlt,
  faFileLines,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const router = useRouter();
  const [isBar, setIsBar] = useState(false);
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("EmployeeAuthToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("selectedSection");
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    try {
      const authToken = localStorage.getItem("EmployeeAuthToken");
      const decoded = jwtDecode(authToken);
      console.log(decoded);
      setEmail(decoded.email);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/liquorBrand/updateClosing");
      localStorage.removeItem("EmployeeAuthToken");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleBar = async () => {
    try {
      const newIsBarState = !isBar;
      const response = await axios.post(
        "http://localhost:5000/api/auth/updateBarState",
        { email, isBar: newIsBarState }
      );
      if (response.status === 200) {
        setIsBar(newIsBarState);
        if (newIsBarState) {
          router.push("/barLogin"); // Redirect to the desired page when bar is enabled
        }
      } else {
        console.error("Failed to toggle bar:", response.data.message);
      }
    } catch (error) {
      console.error("Error toggling bar:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <div>
        <section className="text-gray-600 body-font m-5 p-5 font-sans relative  justify-center items-center flex mt-80">
          <div className="flex flex-col sm:flex-row justify-between items-center  md:fixed lg:fixed fixed ml-3 ">
            <div className="sm:w-1/2 sm:mr-5 sm:mb-0 hidden md:hidden bg-cover lg:block text-center lg:mt-7 ">
              <Image src="/amico.png" alt="logo" height={430} width={420} />

              {/*
                
                 <div>
                <footer className=" text-xs md:text-sm lg:text-sm lg:pr-16 lg:mt-2 md:mt-1 whitespace-nowrap">
                  &copy; AB Software Solution. All Rights Reserved.
                </footer>
                <footer className=" text-xs md:text-sm lg:text-sm lg:pr-16">
                  Call Us: 7083570386 / 8888732973
                </footer>
                <footer className=" text-xs md:text-sm lg:text-sm lg:pr-16">
                  Technical Support: 9699810037
                </footer>
              </div>
                
                */}
            </div>

            {userRole !== "adminBar" && (
              <div className="fixed top-16 right-5 z-30 font-sans">
                <div className="flex items-center">
                  <button
                    onClick={toggleBar}
                    className={`w-12 h-12 flex items-center justify-center rounded-full focus:outline-none ${
                      isBar ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={isBar ? faToggleOn : faToggleOff}
                      className={`text-white text-2xl`}
                    />
                  </button>
                  <span className="ml-3 text-base font-semibold">
                    {isBar ? "Bar" : "Bar"}
                  </span>
                </div>
              </div>
            )}

            <div className="lg:ml-10">
              <div className="sm:w-1/2">
                <div className=" px-5 py-20 mx-auto ">
                  <div className="mx-auto">
                    <div className="lg:flex">
                      <div className="sm:w-1/2 md:w-full sm:h-1/2 p-4 md:ml-10 lg:mr-4">
                        <Link href="/order">
                          <div className="relative h-32 rounded-md overflow-hidden bg-gray-200 border-2 flex flex-col items-center justify-center text-center lg:w-56 md:w-48 w-48 hover:bg-gray-100 hover:border-gray-400">
                            <div className="bg-violet-300 p-3.5 px-5 rounded-full border-2">
                              <FontAwesomeIcon
                                icon={faBellConcierge}
                                size="2xl"
                                color="blue"
                              />
                            </div>
                            <div className="mt-4">
                              <h3 className="text-gray-900 font-semibold mb-1 text-base">
                                Order
                              </h3>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-3 right-4 z-30 fony-sans">
          <button
            onClick={handleLogout}
            className="bg-red-200 hover:bg-red-300 text-red-700 py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline-red font-bold text-base"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
