"use client";

// pages/Orders.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { decode } from 'jsonwebtoken';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAnglesLeft, faAnglesRight, faPenToSquare, faPlus, faTrash, faTimes, } from "@fortawesome/free-solid-svg-icons";
import Flag from "../flag/page";



const EditReports = () => {
  const [originalOrders, setOriginalOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hotelInfo, setHotelInfo] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Add selectedOrder state
  const [currentOrder, setCurrentOrder] = useState([]);
  const [searchBillNumber, setSearchBillNumber] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState([]);


  useEffect(() => {
    // Set both start and end dates using the getFormattedDate function
    const date = getFormattedDate();
    setStartDate(date);
    setEndDate(date);
  }, []);

  function getFormattedDate() {
    const now = new Date();
    const currentHour = now.getHours();

    // If the current hour is before 3 AM, use the previous day's date
    // Otherwise, use the current date
    if (currentHour < 3) {
      const prevDay = new Date(now);
      prevDay.setDate(prevDay.getDate() - 1);
      const year = prevDay.getFullYear();
      const month = (prevDay.getMonth() + 1).toString().padStart(2, '0');
      const day = prevDay.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  const router = useRouter()

{/*
    useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/reportLogin");
    } else {
      const decodedToken = decode(token);
      if (!decodedToken || decodedToken.role !== "superAdminBar") {
        router.push("/reportLogin");
      }
    }
  }, []);
  
  */}



  const handleReset = () => {
    // Function to get the formatted date
    const getFormattedDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
  
    // Set the default values for startDate and endDate as the current date
    const defaultDate = getFormattedDate(new Date());
  
    // Reset to default values
    setStartDate(defaultDate);
    setEndDate(defaultDate);
    setSearchBillNumber("");
    setFilteredPurchases(orders);
  };
  
  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        // Fetch all hotels
        const allHotelsResponse = await axios.get(
          "http://localhost:5000/api/hotel/get-all"
        );
        const allHotels = allHotelsResponse.data;

        // Assuming you want to use the first hotel's ID (you can modify this logic)
        const defaultHotelId = allHotels.length > 0 ? allHotels[0]._id : null;

        if (defaultHotelId) {
          // Fetch information for the first hotel
          const response = await axios.get(
            `http://localhost:5000/api/hotel/get/${defaultHotelId}`
          );
          const hotelInfo = response.data;

          setHotelInfo(hotelInfo);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/order/orders/date?startDate=${startDate}&endDate=${endDate}`
      );

      const ordersWithTableNames = await Promise.all(
        response.data.map(async (order) => {
          const tableResponse = await axios.get(
            `http://localhost:5000/api/table/tables/${order.tableId}`
          );
          return {
            ...order,
            tableName: tableResponse.data.tableName || "Unknown Table",
          };
        })
      );

      console.log(ordersWithTableNames)
      setOrders(ordersWithTableNames);
      setOriginalOrders(ordersWithTableNames);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Error fetching orders");
      setLoading(false);
    }
  };

  

  const handleOrderClick = (order) => {
    if (order.orderNumber) {
      setSelectedOrder(order);
      setCurrentOrder(order.items || []);

      // Redirect to the edit page with the selected order ID
      const orderNumber = order.orderNumber;
      router.push(`/edit/${orderNumber}`);
    } else {
      console.error("Order Number is undefined");
      // Handle the error or provide feedback to the user
    }
  };

  const calculateTotal = (fieldName) => {
    return orders.reduce((total, order) => {
      // Convert the field value to a number before adding to the total
      const fieldValue = parseFloat(order[fieldName]) || 0;
      return total + fieldValue;
    }, 0);
  };

  // const handleSearch = () => {
  //   const filteredOrders = originalOrders.filter((order) => {
  //     const orderDate = new Date(order.orderDate).toISOString().split("T")[0];
  //     const start = startDate || "0000-01-01";
  //     const end = endDate || "9999-12-31";
  //     return orderDate >= start && orderDate <= end;
  //   });

  //   setOrders(filteredOrders);
  // };

  const handleSearch = () => {
    const filteredOrders = originalOrders.filter((order) => {
      const orderDate = new Date(order.orderDate).toISOString().split("T")[0];
      const start = startDate || "0000-01-01";
      const end = endDate || "9999-12-31";
  
      // Check for an exact match with the order number (if provided)
      const isOrderNumberMatch = searchBillNumber
        ? order.orderNumber === searchBillNumber
        : true;
  
      // Filter by both date range and exact order number match
      return (
        orderDate >= start &&
        orderDate <= end &&
        isOrderNumberMatch
      );
    });
  
    setOrders(filteredOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate]); // Update the effect dependencies to include startDate and endDate

  const handlePrint = () => {
    const printContent = orders.map((order) => ({
      tableName: order.tableName,
      items: order.items.map(
        (item) =>
          `${item.name} x ${item.quantity} - Rs.${item.price * item.quantity}`
      ),
      total: order.total,
    }));

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);
    const dateRange =
      startDate && endDate
        ? `${startDateFormatted} - ${endDateFormatted}`
        : "(All Dates)";

    const startDates = formatDate(startDate);

  }

 


    const handleUpdateOrders = async () => {

        try {
          // Make a request to the backend API to update orders with flag true
          const response = await axios.put("http://localhost:5000/api/order/orders/flag");
          console.log(response); // Log the response to the console
        } catch (error) {
          // Handle error
          console.log("No Order Found")
        }
      };
    
    
      return (
        <>
          <Navbar />
          <div className="container mx-auto mt-10 p-2 bg-white rounded-md shadow-md font-sans overflow-x-auto">
    
            {/* <Flag /> */}
            <h1 className="text-xl font-bold mb-2 text-orange-500">Edit Bill</h1>
            <div className="mb-4 lg:flex md:flex items-center">
              <label className="mr-2 mb-2 text-gray-600">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mb-2 mr-2 w-md md:w-auto border rounded-md p-1 text-gray-700 text-sm"
              />
              <div>
                <label className="mx-2 mb-2 text-gray-600">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mb-2 mr-2 w-md md:w-auto border rounded-md p-1 text-gray-700 text-sm"
                /></div>
            <div className="mb-4 lg:flex md:flex items-center">
            <input
              type="text"
              placeholder="Search Date/Bill"
              value={searchBillNumber}
              onChange={(e) => setSearchBillNumber(e.target.value)}
              className="border rounded-full p-1 text-gray-900 mb-2 sm:mb-0 ml-3 font-semibold md:text-sm text-sm lg:w-48"
            />
           </div >
           <div className="mb-4 lg:flex md:flex items-center">
            <button
              className="text-orange-600 font-bold py-1 rounded-lg bg-orange-50 mr-2 px-2 ml-3 md:text-sm text-sm border"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="text-orange-600 font-bold py-1 rounded-lg bg-orange-50 mr-2 px-2 md:text-sm text-sm border"
              onClick={handleReset}
            >
              Reset
            </button>
            </div>
              
            </div>
            {loading ? (
              <p className="text-gray-700">Loading orders...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="h-[500px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-base bg-zinc-100 text-yellow-700 border">
                    <tr>
                      <th className="px-3 py-2  text-left text-xs leading-4 font-medium  uppercase tracking-wider whitespace-nowrap">
                        SR No
                      </th>
                      <th className="px-3 py-2  text-center text-xs leading-4 font-medium  uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2  text-center text-xs leading-4 font-medium  uppercase tracking-wider whitespace-nowrap">
                        Section-Name
                      </th>
                      <th className="px-3 py-2  text-center text-xs leading-4 font-medium  uppercase tracking-wider whitespace-nowrap">
                        Table Name
                      </th>
                      <th className="px-2 py-1  text-center text-xs leading-4 font-medium  uppercase tracking-wider whitespace-nowrap">
                        Bill No.
                      </th>
    
                     
                      <th className="px-2 py-1 text-center text-xs leading-4 font-medium  uppercase tracking-wider whitespace-nowrap">
                        Grand Total
                      </th>
                      <th className="px-2 py-1 text-center text-xs leading-4 font-medium  uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order._id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-1  text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                          {index + 1}
                        </td>
                        <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                          {order.sectionName}
                        </td>
                        <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                          {order.tableName}
                        </td>
    
                        <td className="px-6 py-1  text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                          {order.orderNumber.replace(/\D/g, "")}
                        </td>
                        
    
                        <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                          {Math.round(order.grandTotal)}
                        </td>
                        <td className="px-6 py-1 text-sm whitespace-no-wrap border-b border-gray-200 text-center">
                        <button
                          className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md"
                         onClick={() =>  handleOrderClick(order)}
                         >
                         <FontAwesomeIcon icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer" />{" "}

                          </button>
                        </td>
                        
                        
                      </tr>
                    ))}
    
                    
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      );
    };
    
    export default EditReports;