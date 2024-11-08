'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Image from "next/image";
import PaymentModal from "../payment/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

// Initialize SpeechRecognition
const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const Bill = () => {
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
  const [inputTableNumber, setInputTableNumber] = useState(""); // New state for the input
  const inputRef = useRef(null); // Ref to hold the input element reference
  const [timeoutId, setTimeoutId] = useState(null);
  const [items, setItems] = useState([]);
  const [isListening, setIsListening] = useState(false); // For speech recognition state

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    // Focus on the input field when the component mounts
    inputRef.current.focus();

    // Listen for key presses on the document
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleOpenTable();
        event.preventDefault(); // Prevent the default form submission behavior
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [inputTableNumber, selectedSection]); // Dependency array ensures this runs when input or section changes

  const handleOpenTable = (spokenTableNumber) => {
    clearTimeout(timeoutId); // Clear the timeout when Enter is pressed
  
    console.log("Tables array:", tables);  // Log the tables array for debugging
    console.log("Spoken table number:", spokenTableNumber);  // Log the recognized table number
  
    // Match the table using the tableName field
    const foundTable = tables.find(
      (table) => table.tableName === spokenTableNumber && table.section._id === selectedSection
    );
  
    if (foundTable) {
      console.log("Found table:", foundTable);  // Log the found table
  
      // Check if the bill is temporary and needs payment, else push to order page
      if (bills[foundTable._id]?.isTemporary && bills[foundTable._id]?.isPrint === 1) {
        handlePaymentModalOpen(foundTable);
      } else {
        // Navigate to the order page for the found table
        window.location.href = `/order/${foundTable._id}`;
      }
    } else {
      console.log(`Table with name ${spokenTableNumber} not found in the selected section.`);
    }
  };


  
  // Speech recognition start function
  const startListening = () => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
  
      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Speech recognized:", speechResult);
  
        // Check for command to open a specific table
        const tableNumberMatch = speechResult.match(/open table (\d+)/);
  
        if (tableNumberMatch) {
          const tableNumber = tableNumberMatch[1].trim();  // Extract table number from speech
          console.log(`Opening table ${tableNumber}`);
  
          // Set the inputTableNumber to match the recognized table number
          setInputTableNumber(tableNumber);
          handleOpenTable(tableNumber);
        } else {
          console.log("No valid table number found in speech.");
        }
      };
  
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
  
      recognition.onend = () => {
        setIsListening(false);
      };
  
      recognition.start();
      setIsListening(true);
    } else {
      console.log("Speech Recognition API is not supported in this browser.");
    }
  };
  

  const handleSectionRadioChange = (sectionId) => {
    setSelectedSection((prevSection) =>
      prevSection === sectionId ? null : sectionId
    );
  };

  useEffect(() => {
    // Focus on the input field when the selectedSection changes
    inputRef.current.focus();
  }, [selectedSection]);

  useEffect(() => {
    if (!isPaymentModalOpen) {
      inputRef.current.focus();
    }
  }, [isPaymentModalOpen]);

  const handlePageClick = () => {
    if (!isPaymentModalOpen) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handlePageClick);

    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, [isPaymentModalOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsResponse = await axios.get(
          "http://localhost:5000/api/section"
        );
        setSections(sectionsResponse.data);

        const tablesResponse = await axios.get(
          "http://localhost:5000/api/table/tables"
        );
        console.log(tablesResponse.data)
        setTables(tablesResponse.data);

        const defaultSection = sectionsResponse.data.find(
          (section) => section.isDefault
        );
        if (defaultSection) {
          setDefaultSectionId(defaultSection._id);
          setSelectedSection(defaultSection._id);
        }

        const billsData = await Promise.all(
          tablesResponse.data.map(async (table) => {
            const billsResponse = await axios.get(
              `http://localhost:5000/api/order/order/${table._id}`
            );

            const temporaryBills = billsResponse.data.filter(
              (bill) => bill.isTemporary
            );
            const latestBill =
              temporaryBills.length > 0 ? temporaryBills[0] : null;

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
  }, []);

  useEffect(() => {
    const updateDisplayedTables = () => {
      if (selectedSection) {
        const filteredTables = tables.filter(
          (table) => table.section._id === selectedSection
        );
        setDisplayedTables(filteredTables);
      } else if (defaultSectionId) {
        const defaultTables = tables.filter(
          (table) => table.section._id === defaultSectionId
        );
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


  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-10 md:px-1 lg:px-1 xl:px-1 justify-around font-sans mt-12">
      {/* <button
          onClick={startListening}
          className={`p-2 rounded-full ${isListening ? "bg-red-500" : "bg-blue-500"}`}
        >
          {isListening ? "Listening..." : "Start Voice Command"}
        </button> */}
        <div>
          <ul className=" grid grid-cols-1 bg-white  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-5">
            {sections.map((section) => (
              <li
                key={section._id}
                className="mb-2 md:mb-0 bg-white p-1 rounded-2xl px-4 shadow-md hover:bg-slate-100"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-500 rounded-full shadow-inner flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUtensils}
                      size="sm"
                      color="blue"
                    />
                  </div>
                  <input
                    className="cursor-pointer ml-2"
                    type="radio"
                    id={section._id}
                    name="section"
                    checked={selectedSection === section._id}
                    onChange={() => handleSectionRadioChange(section._id)}
                  />
                  <label
                    className="cursor-pointer font-semibold block md:inline-block p-2 text-gray-600 "
                    htmlFor={section._id}
                  >
                    {section.name}
                  </label>
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
          // className="opacity-1"

          />
        </div>
        <div className="grid grid-cols-2 lg:p-9 md:p-5 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8 gap-7 mt-4 p-1">
          {displayedTables.map((table) => (
            <div key={table._id}>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold -mt-3">
                {table.tableName}
              </h3>
              <div
                className={`bg-white cursor-pointer custom-scrollbar overflow-y-auto p-2 rounded-md border-2 
                ${bills[table._id]?.isTemporary
                    ? bills[table._id]?.isPrint === 1
                      ? "border-blue-600"
                      : "border-orange-400"
                    : "border-gray-500"
                  } w-full h-44 transform transition-transform hover:scale-150`}
                onClick={() => {
                  if (
                    bills[table._id]?.isTemporary &&
                    bills[table._id]?.isPrint === 1
                  ) {
                    handlePaymentModalOpen(table);
                  } else {
                    window.location.href = `/order/${table._id}`;
                  }
                }}
              >
                {bills[table._id] && bills[table._id].isTemporary ? (
                  <>
                    {bills[table._id]?.orderNumber}
                    {bills[table._id].items.map((item, index) => (
                      <div
                        key={index}
                        className="text-xs text-blue-900 font-semibold"
                      >
                        {item.name} = {item.quantity}
                      </div>
                    ))}
                    <div className="font-semibold mt-3 text-xs text-blue-800">
                      Amount: {Math.round(bills[table._id].grandTotal)}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center text-center h-36">
                    <Image
                      src="/plate.png"
                      alt="logo"
                      height={60}
                      width={60}
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
              items={items} // Pass the items prop
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bill;