"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { faClock, faObjectUngroup, faMoneyBill, faList, faCubes, faShoppingCart, faChair, faMoneyCheckAlt, faTasks, faReceipt, faSignOutAlt, faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";


const Report = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (userRole !== 'superAdmin' && userRole !== 'superAdminBar') {
        router.push("/reportLogin");
      }
    }
  }, [loading, userRole, router]);


  useEffect(() => {
    // Retrieve user role from local storage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      if (decodedToken && decodedToken.role) {
        const userRole = decodedToken.role; // Normalize to lowercase
        console.log(userRole)
        setUserRole(userRole);
      }
    }
    setLoading(false);
  }, []);


  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator until user role is determined
  }


  const handleLogout = () => {
    localStorage.removeItem("authToken")
    router.push("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div>
        <section className="text-gray-600 body-font m-5 p-5 justify-center font-sans mt-8 text-sm">
          <div className="container px-5 py-1 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">


            {userRole === "superAdmin" && (
              <div className="p-4 md:p-4">
                <Link href="/menuReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faClock}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Daily Order Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            )}

              {userRole === "superAdminBar" && (
                <div className="p-4 md:p-4">
                  <Link href="/reports">
                    <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-orange-100 p-2 shadow-md">
                        <FontAwesomeIcon
                          icon={faClock}
                          size="xl"
                          color="orange"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-black font-bold mb-1">
                          Daily Order Report
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="p-4 md:p-4">
                <Link href="/dailyMenuReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faClock}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Daily Menu Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              {userRole === "superAdminBar" && (
                <div className="p-4 md:p-4">
                  <Link href="/dailyBarReport">
                    <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-orange-100 p-2 shadow-md">
                        <FontAwesomeIcon
                          icon={faClock}
                          size="xl"
                          color="orange"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-black font-bold mb-1">
                          Daily Bar Report
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="p-4 md:p-4">
                <Link href="/kotReports">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">KOT Report</h3>
                    </div>
                  </div>
                </Link>
              </div>


              {userRole === "superAdminBar" && (
                <div className="p-4 md:p-4">
                  <Link href="/botReports">
                    <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-orange-100 p-2 shadow-md">
                        <FontAwesomeIcon
                          icon={faReceipt}
                          size="xl"
                          color="orange"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-black font-bold mb-1">BOT Report</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="p-4 md:p-4">
                <Link href="/cancelKot">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon icon={faRectangleXmark}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Cancel KOT Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-4">
                <Link href="/mergeReports">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon icon={faObjectUngroup}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Merge Table Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-4">
                <Link href="/menuReports">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon icon={faList} size="xl" color="orange" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Menu Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>


              {userRole === "superAdminBar" && (
                <div className="p-4 md:p-4">
                  <Link href="/barMenuReport">
                    <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-orange-100 p-2 shadow-md">
                        <FontAwesomeIcon icon={faList} size="xl" color="orange" />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-black font-bold mb-1">
                          Bar Report
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              )}


              {userRole === "superAdminBar" && (
                <div className="p-4 md:p-4">
                  <Link href="/barPurchaseReport">
                    <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-orange-100 p-2 shadow-md">
                        <FontAwesomeIcon
                          icon={faCubes}
                          size="xl"
                          color="orange"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-black font-bold mb-1">
                          Bar Purchase Report
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="p-4 md:p-4">
                <Link href="/stockList">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faCubes}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Stockoutward Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>


              {userRole === "superAdminBar" && (
              <div className="p-4 md:p-4">
                <Link href="/liquorStockReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faCubes}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Liquor Stock Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
              )}


              <div className="p-4 md:p-4">
                <Link href="/purchaseReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Purchase Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-4">
                <Link href="/orderHistory">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faChair}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Edit Bill Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="p-4 md:p-4">
                <Link href="/creditReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faTasks}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Customer Credit Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="p-4 md:p-4">
                <Link href="/customerPaymentReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faTasks}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Customer Payment Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="p-4 md:p-4">
                <Link href="/expenseReport">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faMoneyCheckAlt}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Expenses Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

            
              <div className="p-4 md:p-4">
                <Link href="/editLastBill">
                  <div className="relative h-28 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-2 shadow-md">
                      <FontAwesomeIcon
                        icon={faMoneyCheckAlt}
                        size="xl"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Edit Last Bills
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </section>

        <div className="fixed bottom-3 right-10 z-30">
          <button
            onClick={handleLogout}
            className="bg-red-300 hover:bg-red-400 text-black py-1 px-3 rounded-lg focus:outline-none focus:shadow-outline-red font-bold text-sm"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Report;