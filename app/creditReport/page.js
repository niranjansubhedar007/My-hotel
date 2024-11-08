"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import { decode } from 'jsonwebtoken';
import { useRouter } from "next/navigation";

const CreditReport = () => {
  const [customers, setCustomers] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/reportLogin");
    } else {
      const decodedToken = decode(token);
      if (!decodedToken || (decodedToken.role !== "superAdmin" && decodedToken.role !== "superAdminBar")) {
        router.push("/reportLogin");
      }
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [startDate, endDate, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customer/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const filterRecords = () => {
    const filtered = customers.flatMap(customer =>
      customer.creditBalanceRecords.filter(record => {
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        return recordDate >= startDate && recordDate <= endDate;
      }).map(record => ({
        ...record,
        customerName: customer.customerName,
        mobileNumber: customer.mobileNumber,
        createdAt: customer.createdAt
      }))
    );
    setFilteredRecords(filtered);
  };

  const exportToExcel = () => {
    const sheetData = filteredRecords.map((record, index) => [
      index + 1,
      new Date(record.date).toLocaleDateString("en-GB"),
      record.orderNumber,
      record.customerName,
      record.mobileNumber.toString(),
      record.creditBalance,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      ["Sr", "Date", "Bill No", "Name", "Mobile Number", "Amount"],
      ...sheetData,
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Data");

    XLSX.writeFile(wb, "customer_data.xlsx");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 p-2 bg-white rounded-md shadow-md font-sans">
        <h1 className="text-xl font-bold mb-2 text-orange-500">Credit Report</h1>
        <div className="mb-4 flex flex-wrap items-center">
          <label className="mr-2 text-gray-600">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md text-gray-700 p-1 text-sm"
          />
          <div>
            <label className="text-gray-600 lg:ml-2 md:ml-2">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md text-gray-700 p-1 text-sm ml-4"
            />
          </div>
          <div className="flex flex-wrap">
            <button
              className="bg-blue-100 text-blue-600 text-sm px-4 py-2 rounded-full font-bold hover:bg-blue-200 focus:outline-none focus:shadow-outline-blue md:ml-2 ml-2"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>
        {/* Customer Table */}
        <div className="table-container overflow-x-auto overflow-y-auto text-sm">
          <table className="min-w-full bg-white border border-gray-300 text-left align-middle">
            <thead className="bg-gray-200 text-center">
              <tr className="text-base bg-zinc-100 text-yellow-700 border">
                <th className="border border-gray-300 px-4 py-1">Sr</th>
                <th className="border border-gray-300 px-4 py-1">Date</th>
                <th className="border border-gray-300 px-4 py-1">Bill No</th>
                <th className="border border-gray-300 px-4 py-1">Name</th>
                <th className="border border-gray-300 px-4 py-1">Mobile Number</th>
                <th className="border border-gray-300 px-4 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={record._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{new Date(record.date).toLocaleDateString("en-GB")}</td>
                  <td className="border p-2">{record.orderNumber}</td>
                  <td className="border p-2">{record.customerName}</td>
                  <td className="border p-2">{record.mobileNumber}</td>
                  <td className="border p-2">{record.creditBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CreditReport;
