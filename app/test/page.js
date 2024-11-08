'use client'

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import PaymentModal from "../payment/page";
import { useRouter } from "next/navigation";

const Try = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [tables, setTables] = useState([]);
  const [sections, setSections] = useState([]);
  const [bills, setBills] = useState({});
  const [displayedTables, setDisplayedTables] = useState([]);
  const [defaultSectionId, setDefaultSectionId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState({ tableName: "", totalAmount: 0 });
  const [orderID, setOrderID] = useState(null); 
  const [orderNumber, setOrderNumber] = useState(null);
  const [tablesInUseCount, setTablesInUseCount] = useState(0);
  const [inputTableNumber, setInputTableNumber] = useState("");
  const inputRef = useRef(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [items, setItems] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    inputRef.current.focus();
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleOpenTable();
        event.preventDefault();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [inputTableNumber, selectedSection]);

  const handleOpenTable = () => {
    clearTimeout(timeoutId);
    const foundTable = tables.find((table) => table.tableName === inputTableNumber && table.section._id === selectedSection);

    if (foundTable) {
      if (bills[foundTable._id]?.isTemporary && bills[foundTable._id]?.isPrint === 1) {
        handlePaymentModalOpen(foundTable);
      } else {
        router.push(`/order/${foundTable._id}`);

      }
    } else {
      console.log(`Table with name ${inputTableNumber} not found in the selected section.`);
    }
  };

  const handleSectionRadioChange = (sectionId,sectionName) => {
    setSelectedSection((prevSection) =>
      prevSection === sectionId ? null : sectionId
    );
    // localStorage.setItem("selectedSection", sectionId); // Save to localStorage
    localStorage.setItem("selectedSection", JSON.stringify({ sectionId, sectionName }));
  };

  useEffect(() => {
    if (!isPaymentModalOpen) {
      inputRef.current.focus();
    }
  }, [isPaymentModalOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get("http://localhost:5000/api/section");
        setSections(sectionsResponse.data);

        const tablesResponse = await axios.get("http://localhost:5000/api/table/tables");
        setTables(tablesResponse.data);

        // Retrieve saved section from localStorage
        const savedSection = JSON.parse(localStorage.getItem('selectedSection')) || {};
        const savedSectionId = savedSection.sectionId || null;

        // Find the default section
        const defaultSection = sectionsResponse.data.find((section) => section.isDefault);

        // If there's a saved section in localStorage, use it; otherwise, use the default section
        if (savedSectionId) {
          setSelectedSection(savedSectionId);
        } else if (defaultSection) {
          setDefaultSectionId(defaultSection._id);
          setSelectedSection(defaultSection._id);
        }

        // Fetch bills data
        const billsData = await Promise.all(
          tablesResponse.data.map(async (table) => {
            const billsResponse = await axios.get(`http://localhost:5000/api/order/order/${table._id}`);
            const temporaryBills = billsResponse.data.filter((bill) => bill.isTemporary);
            const latestBill = temporaryBills.length > 0 ? temporaryBills[0] : null;
            return { [table._id]: latestBill };
          })
        );

        const mergedBills = Object.assign({}, ...billsData);
        setBills(mergedBills);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [selectedSection]);

useEffect(() => {
    const updateDisplayedTables = () => {
      if (selectedSection) {
        const filteredTables = tables.filter((table) => table.section._id === selectedSection);
        setDisplayedTables(filteredTables);
      } else if (defaultSectionId) {
        const defaultTables = tables.filter((table) => table.section._id === defaultSectionId);
        setDisplayedTables(defaultTables);
      } else {
        setDisplayedTables([]);
      }
    };

    updateDisplayedTables();
  }, [selectedSection, defaultSectionId, tables]);


  const handlePaymentModalOpen = (table) => {
    setSelectedTable(table);
    const totalAmount = bills[table._id]?.grandTotal || 0;
    const items = bills[table._id]?.items || [];
    setTableInfo({
      tableName: table.tableName,
      totalAmount: totalAmount,
    });

    setOrderID(bills[table._id]?._id);
    setOrderNumber(bills[table._id]?.orderNumber);
    setIsPaymentModalOpen(true);
    setItems(items);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedTable(null);
    setTableInfo({ tableName: "", totalAmount: 0 });
    setOrderID(null);
  };

  useEffect(() => {
    const countTablesInUse = () => {
      const inUseCount = displayedTables.reduce((count, table) => {
        return count + (bills[table._id] ? 1 : 0);
      }, 0);
      setTablesInUseCount(inUseCount);
    };

    countTablesInUse();
  }, [displayedTables, bills]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInputTableNumber("");
    }, 2000);

    setTimeoutId(timeout);
    return () => {
      clearTimeout(timeout);
    };
  }, [inputTableNumber]);


  const handleTableClick = (table) => {
    // Remove selectedParentId from localStorage
    localStorage.removeItem('selectedParentIds')
    localStorage.removeItem('selectedItems')
    localStorage.removeItem('selectedMenusList')

    if (bills[table._id]?.isTemporary && bills[table._id]?.isPrint === 1) {
      handlePaymentModalOpen(table);
    } else {
      // router.push(`/order/${table._id}`);
      router.push(`/order/${table._id}`, undefined, { shallow: true });

    }

  };

  return (
    <div>
      <div className="container mx-auto px-2 md:px-1 lg:px-1 xl:px-1 justify-around font-sans mt-3">
        <div>
        <ul className="grid grid-cols-2 whitespace-nowrap lg:-mt-4 md:-mt-5 -mt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7  ml-1 gap-4 custom-scrollbars overflow-x-auto cursor-pointer">
        {sections.map((section) => (
          <li
            key={section._id}
            className={`mb-4 md:mb-2 lg:mb-1 p-1 rounded-md px-1 py-2  hover:bg-yellow-300 lg:w-32 w-28 border border-yellow-500 cursor-pointer ${
              selectedSection === section._id ? "bg-yellow-200 text-[#243642]" : ""
            }`}
            onClick={() => handleSectionRadioChange(section._id, section.name)}
          >
            <div className="flex items-center justify-center font-semibold text-[#387478 text-sm">
              {section.name}
            </div>
          </li>
        ))}
      </ul>
        </div>
        <div className="mt-4 text-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter table number"
            value={inputTableNumber}
            onChange={(event) => setInputTableNumber(event.target.value)}
            className="sr-only"
          />
        </div>
        <div className="flex gap-4 custom-scrollbars overflow-y-auto lg:w-[100%] mb-2 px-2">
          {displayedTables.map((table) => (
            <div key={table._id}>
              <div
                className={`bg-white cursor-pointer mb-2 p-2 rounded-md border-2 
                ${bills[table._id]?.isTemporary
                    ? bills[table._id]?.isPrint === 1
                      ? "border-green-600 bg-[#9ee8b5]"
                      : "border-yellow-600 bg-yellow-100"
                    : "border-gray-500"
                  } w-16 h-12 `}

                onClick={() => handleTableClick(table)}

              >
                <div className="text-xs md:text-xs lg:text-sm font-semibold -mt-2">
                  {table.tableName}
                </div>
                {bills[table._id] && bills[table._id].isTemporary ? (
                  <div className="font-semibold text-xs text-[#000] lg:ml-2 md:ml-2 ml-2">
                    ₹{Math.round(
                      bills[table._id].items
                        .filter(item => !item.isCanceled)
                        .reduce((total, item) => total + (item.price * item.quantity), 0)
                      + bills[table._id].CGST
                      + bills[table._id].SGST
                      + bills[table._id].VAT
                      + bills[table._id].acPercentageAmount
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center text-center lg:-mt-1">
                    <Image
                      src="/plate.png"
                      alt="logo"
                      height={20}
                      width={20}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isPaymentModalOpen && (
            <PaymentModal
              onClose={handlePaymentModalClose}
              tableName={tableInfo.tableName}
              totalAmount={tableInfo.totalAmount}
              orderID={orderID}
              orderNumber={orderNumber}
              items={items}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Try;
