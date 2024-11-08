// 'use client'

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// // import Navbar from "../components/Navbar";
// import Image from "next/image";
// import PaymentModal from "../payment/page";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";
// import { useRouter } from "next/navigation";

// const Try = () => {
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [tables, setTables] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [bills, setBills] = useState({});
//   const [displayedTables, setDisplayedTables] = useState([]);
//   const [defaultSectionId, setDefaultSectionId] = useState(null);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [tableInfo, setTableInfo] = useState({ tableName: "", totalAmount: 0 });
//   const [orderID, setOrderID] = useState(null);
//   const [orderNumber, setOrderNumber] = useState(null);
//   const [tablesInUseCount, setTablesInUseCount] = useState(0);
//   const [inputTableNumber, setInputTableNumber] = useState(""); // New state for the input
//   const inputRef = useRef(null); // Ref to hold the input element reference
//   const [timeoutId, setTimeoutId] = useState(null);
//   const [items, setItems] = useState([]);

//   const router = useRouter()
    
//     useEffect(() => {
//         const authToken = localStorage.getItem("EmployeeAuthToken");
//         if (!authToken) {
//             router.push("/login");
//         }
//     }, []);

//   useEffect(() => {
//     // Focus on the input field when the component mounts
//     inputRef.current.focus();

//     // Listen for key presses on the document
//     const handleKeyPress = (event) => {
//       if (event.key === "Enter") {
//         handleOpenTable();
//         event.preventDefault(); // Prevent the default form submission behavior
//       }
//     };

//     document.addEventListener("keypress", handleKeyPress);

//     // Clean up the event listener when the component is unmounted
//     return () => {
//       document.removeEventListener("keypress", handleKeyPress);
//     };
//   }, [inputTableNumber, selectedSection]); // Empty dependency array ensures this runs only once on mount


//   const handleOpenTable = () => {
//     clearTimeout(timeoutId); // Clear the timeout when Enter is pressed
//     const foundTable = tables.find((table) => table.tableName === inputTableNumber && table.section._id === selectedSection);
  
//     if (foundTable) {
//       if (bills[foundTable._id]?.isTemporary && bills[foundTable._id]?.isPrint === 1) {
//         handlePaymentModalOpen(foundTable);
//       } else {
//         window.location.href = `/order/${foundTable._id}`;
//       }
//     } else {
//       console.log(`Table with name ${inputTableNumber} not found in the selected section.`);
//     }
//   };
  


//   const handleSectionRadioChange = (sectionId) => {
//     setSelectedSection((prevSection) =>
//       prevSection === sectionId ? null : sectionId
//     );
//   };

//   useEffect(() => {
//     // Focus on the input field when the selectedSection changes
//     inputRef.current.focus();
//   }, [selectedSection]);

//   useEffect(() => {
//     // Focus on the input field when isPaymentModalOpen changes
//     if (!isPaymentModalOpen) {
//       inputRef.current.focus();
//     }
//   }, [isPaymentModalOpen]);


//   // const handleClick = () => {
//   //   inputRef.current.focus();
//   // };

//   // useEffect(() => {
//   //   document.addEventListener('click', handleClick);

//   //   return () => {
//   //     document.removeEventListener('click', handleClick);
//   //   };
//   // }, []); // Empty dependency array ensures this runs only once on mount
//   const handlePageClick = (event) => {
//     // Check if the payment modal is open
//     if (!isPaymentModalOpen) {
//       // Focus on the input field when the user clicks on the page
//       inputRef.current.focus();
//     }
//   };

//   useEffect(() => {
//     // Attach click event listener to the document
//     document.addEventListener('click', handlePageClick);

//     // Clean up the event listener when the component is unmounted
//     return () => {
//       document.removeEventListener('click', handlePageClick);
//     };
//   }, [isPaymentModalOpen]);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const sectionsResponse = await axios.get(
//           "http://localhost:5000/api/section"
//         );
//         setSections(sectionsResponse.data);

//         const tablesResponse = await axios.get(
//           "http://localhost:5000/api/table/tables"
//         );
//         setTables(tablesResponse.data);

//         const defaultSection = sectionsResponse.data.find(
//           (section) => section.isDefault
//         );
//         if (defaultSection) {
//           setDefaultSectionId(defaultSection._id);
//           setSelectedSection(defaultSection._id);
//         }

//         const billsData = await Promise.all(
//           tablesResponse.data.map(async (table) => {
//             const billsResponse = await axios.get(
//               `http://localhost:5000/api/order/order/${table._id}`
//             );

//             const temporaryBills = billsResponse.data.filter(
//               (bill) => bill.isTemporary
//             );
//             const latestBill =
//               temporaryBills.length > 0 ? temporaryBills[0] : null;

//             return { [table._id]: latestBill };
//           })
//         );

//         const mergedBills = Object.assign({}, ...billsData);
//         setBills(mergedBills);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []); // Remove dependencies to fetch data once on component mount

//   useEffect(() => {
//     const updateDisplayedTables = () => {
//       if (selectedSection) {
//         const filteredTables = tables.filter(
//           (table) => table.section._id === selectedSection
//         );
//         setDisplayedTables(filteredTables);
//       } else if (defaultSectionId) {
//         const defaultTables = tables.filter(
//           (table) => table.section._id === defaultSectionId
//         );
//         setDisplayedTables(defaultTables);
//       } else {
//         setDisplayedTables([]);
//       }
//     };

//     updateDisplayedTables();
//   }, [selectedSection, defaultSectionId, tables]);

//   const handlePaymentModalOpen = (table) => {
//     setSelectedTable(table);
//     const totalAmount = bills[table._id]?.total || 0;
//     const items = bills[table._id]?.items || []; // Extract items data
//     setTableInfo({
//       tableName: table.tableName,
//       totalAmount: totalAmount,
//     });
  
//     setOrderID(bills[table._id]?._id);
//     setOrderNumber(bills[table._id]?.orderNumber);
//     setIsPaymentModalOpen(true);
//     setItems(items); // Set the items state
//   };
  

//   const handlePaymentModalClose = () => {
//     setIsPaymentModalOpen(false);
//     setSelectedTable(null);
//     setTableInfo({ tableName: "", totalAmount: 0 });
//     setOrderID(null);
//   };

//   useEffect(() => {
//     // Count the tables in use
//     const countTablesInUse = () => {
//       const inUseCount = displayedTables.reduce((count, table) => {
//         return count + (bills[table._id] ? 1 : 0);
//       }, 0);
//       setTablesInUseCount(inUseCount);
//     };

//     countTablesInUse();
//   }, [displayedTables, bills]);

//   useEffect(() => {
//     // Set a timeout to clear the input field after 2 seconds
//     const timeout = setTimeout(() => {
//       setInputTableNumber("");
//     }, 2000);

//     // Save the timeout ID to clear it if Enter is pressed
//     setTimeoutId(timeout);

//     // Clear the timeout on component unmount
//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [inputTableNumber]);

//   return (
//     <div>
//       {/* <Navbar /> */}
//       <div className="container mx-auto px-10 md:px-1 lg:px-1 xl:px-1 justify-around font-sans mt-3">
//         <div>
//           <ul className=" grid grid-cols-2 bg-white  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-5">
//             {sections.map((section) => (
//               <li
//                 key={section._id}
//                 className="mb-2 md:mb-0 bg-white p-0.5 rounded-2xl px-1 shadow-md hover:bg-slate-100"
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-1 w-1 bg-blue-100 text-blue-500 rounded-full shadow-inner flex items-center justify-center">
//                     <FontAwesomeIcon
//                       icon={faUtensils}
//                       size="sm"
//                       color="blue"
//                     />
//                   </div>
//                   <input
//                     className="cursor-pointer ml-2"
//                     type="radio"
//                     id={section._id}
//                     name="section"
//                     checked={selectedSection === section._id}
//                     onChange={() => handleSectionRadioChange(section._id)}
//                   />
//                   <label
//                     className="cursor-pointer font-semibold block md:inline-block p-1 text-gray-600 text-xs"
//                     htmlFor={section._id}
//                   >
//                     {section.name}
//                   </label>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         {/* <div className="mt-4 text-center">
//           <p>Tables in use: {tablesInUseCount}</p>
//         </div> */}
//         <div className="mt-4 text-center">
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Enter table number"
//             value={inputTableNumber}
//             onChange={(event) => setInputTableNumber(event.target.value)}
//             className="sr-only"
//           // className="opacity-1"

//           />
//         </div>
//         <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4 mt-4 p-1">
//           {displayedTables.map((table) => (
//             <div key={table._id}>
//               <h3 className="text-xs md:text-xs lg:text-xs font-semibold -mt-3">
//                 {table.tableName}
//               </h3>
//               <div
//                 className={`bg-white cursor-pointer custom-scrollbar overflow-y-auto p-2 rounded-md border-2 
//                 ${bills[table._id]?.isTemporary
//                     ? bills[table._id]?.isPrint === 1
//                       ? "border-blue-600"
//                       : "border-orange-400"
//                     : "border-gray-500"
//                   } w-8 h-8 transform transition-transform hover:scale-150`}
//                 onClick={() => {
//                   if (
//                     bills[table._id]?.isTemporary &&
//                     bills[table._id]?.isPrint === 1
//                   ) {
//                     handlePaymentModalOpen(table);
//                   } else {
//                     window.location.href = `/order/${table._id}`;
//                   }
//                 }}
//               >
//                 {bills[table._id] && bills[table._id].isTemporary ? (
//                   <>
//                     {bills[table._id]?.orderNumber}
//                     {bills[table._id].items.map((item, index) => (
//                       <div
//                         key={index}
//                         className="text-xs text-blue-900 font-semibold"
//                       >
//                         {item.name} = {item.quantity}
//                       </div>
//                     ))}
//                     <div className="font-semibold mt-3 text-xs text-blue-800">
//                       Amount: {Math.round(bills[table._id].total)}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex justify-center items-center text-center h-36">
//                     <Image
//                       src="/plate.png"
//                       alt="logo"
//                       height={60}
//                       width={60}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//           {isPaymentModalOpen && (
//             <PaymentModal
//               onClose={handlePaymentModalClose}
//               tableName={tableInfo.tableName}
//               totalAmount={tableInfo.totalAmount}
//               orderID={orderID}
//               orderNumber={orderNumber}
//               items={items} // Pass the items prop

//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Try;






// "use client"

// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';

// const MenuList = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [purchaseMenuData, setPurchaseMenuData] = useState(null);
//   const [sellMenuData, setSellMenuData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [closingStockData, setClosingStockData] = useState(null);


//   useEffect(() => {
//     // Set the selected date to the current date in the format YYYY-MM-DD
//     const currentDate = new Date().toISOString().split('T')[0];
//     setSelectedDate(currentDate);
//   }, []);


//   const fetchMenuData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/stockQty/barmenus?date=${selectedDate}`);
//       const data = await res.json();
//       setMenuData(data);
//     } catch (error) {
//       console.error('Error fetching menu data:', error);
//     }
//   };

//   const fetchPurchaseData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/stockQty/barmenu?date=${selectedDate}`);
//       const data = await res.json();
//       setPurchaseMenuData(data);
//     } catch (error) {
//       console.error('Error fetching purchase data:', error);
//     }
//   };

//   const fetchSellData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/order/stockQty/sellQty?date=${selectedDate}`);
//       const data = await res.json();
//       setSellMenuData(data);
//     } catch (error) {
//       console.error('Error fetching sell data:', error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchMenuData();
//       fetchPurchaseData();
//       fetchSellData();
//     }
//   }, [selectedDate]);


//   useEffect(() => {
//     if (menuData && purchaseMenuData && sellMenuData) {
//       const timer = setTimeout(() => {
//         const newClosingStockData = menuData.map((item) => {
//           const openingStock30ml = item.childMenus.find((menu) => menu.name.endsWith('30ml'))?.stockQty || 0;
//           const openingStock60ml = item.childMenus.find((menu) => menu.name.endsWith('60ml'))?.stockQty || 0;
//           const openingStock90ml = item.childMenus.find((menu) => menu.name.endsWith('90ml'))?.stockQty || 0;
//           const openingStock180ml = item.childMenus.find((menu) => menu.name.endsWith('180ml'))?.stockQty || 0;
//           const openingStock750ml = item.childMenus.find((menu) => menu.name.endsWith('750ml'))?.stockQty || 0;

//           const purchaseQty30ml = purchaseMenuData.find((purchaseItem) => purchaseItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('30ml'))?.stockQty || 0;
//           const purchaseQty60ml = purchaseMenuData.find((purchaseItem) => purchaseItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('60ml'))?.stockQty || 0;
//           const purchaseQty90ml = purchaseMenuData.find((purchaseItem) => purchaseItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('90ml'))?.stockQty || 0;
//           const purchaseQty180ml = purchaseMenuData.find((purchaseItem) => purchaseItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('180ml'))?.stockQty || 0;
//           const purchaseQty750ml = purchaseMenuData.find((purchaseItem) => purchaseItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('750ml'))?.stockQty || 0;

//           const sellQty30ml = sellMenuData.find((sellItem) => sellItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('30ml'))?.sellQty || 0;
//           const sellQty60ml = sellMenuData.find((sellItem) => sellItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('60ml'))?.sellQty || 0;
//           const sellQty90ml = sellMenuData.find((sellItem) => sellItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('90ml'))?.sellQty || 0;
//           const sellQty180ml = sellMenuData.find((sellItem) => sellItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('180ml'))?.sellQty || 0;
//           const sellQty750ml = sellMenuData.find((sellItem) => sellItem.name === item.name)?.childMenus.find((menu) => menu.name.endsWith('750ml'))?.sellQty || 0;

//           const calculateClosingStock = (openingStock, purchaseQty, sellQty) => {
//             const closingStock = openingStock + purchaseQty - sellQty;
//             return closingStock < 0 ? 0 : closingStock;
//           };

//           //     return {
//           //       name: item.name,
//           //       closingStock30ml: openingStock30ml + purchaseQty30ml - sellQty30ml,
//           //       closingStock60ml: openingStock60ml + purchaseQty60ml - sellQty60ml,
//           //       closingStock90ml: openingStock90ml + purchaseQty90ml - sellQty90ml,
//           //       closingStock180ml: openingStock180ml + purchaseQty180ml - sellQty180ml,
//           //       closingStock750ml: openingStock750ml + purchaseQty750ml - sellQty750ml,
//           //     };
//           //   });
//           //   setClosingStockData(newClosingStockData);
//           // }, 1000);

//           return {
//             name: item.name,
//             closingStock30ml: calculateClosingStock(openingStock30ml, purchaseQty30ml, sellQty30ml),
//             closingStock60ml: calculateClosingStock(openingStock60ml, purchaseQty60ml, sellQty60ml),
//             closingStock90ml: calculateClosingStock(openingStock90ml, purchaseQty90ml, sellQty90ml),
//             closingStock180ml: calculateClosingStock(openingStock180ml, purchaseQty180ml, sellQty180ml),
//             closingStock750ml: calculateClosingStock(openingStock750ml, purchaseQty750ml, sellQty750ml),
//           };
//         });
//         setClosingStockData(newClosingStockData);
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [menuData, purchaseMenuData, sellMenuData]);

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const exportToExcel = () => {
//     if (!menuData || !purchaseMenuData || !sellMenuData || !closingStockData) {
//       console.error('Data not yet loaded');
//       return;
//     }

//     const formatData = (data) => data.map(item => ({
//       name: item.name,
//       '30ml': item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQty || '0',
//       '60ml': item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQty || '0',
//       '90ml': item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQty || '0',
//       '180ml': item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQty || '0',
//       '750ml': item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQty || '0',
//     }));

//     const formatClosingStockData = (data) => data.map(item => ({
//       name: item.name,
//       '30ml': item.closingStock30ml,
//       '60ml': item.closingStock60ml,
//       '90ml': item.closingStock90ml,
//       '180ml': item.closingStock180ml,
//       '750ml': item.closingStock750ml,
//     }));

//     const exportData = [
//       { sheetName: 'Opening Stock', data: formatData(menuData) },
//       { sheetName: 'Purchase Stock', data: formatData(purchaseMenuData) },
//       { sheetName: 'Sell Data', data: formatData(sellMenuData) },
//       { sheetName: 'Closing Stock Data', data: formatClosingStockData(closingStockData) }
//     ];

//     const wb = XLSX.utils.book_new();

//     exportData.forEach(({ sheetName, data }) => {
//       const ws = XLSX.utils.json_to_sheet(data);
//       XLSX.utils.book_append_sheet(wb, ws, sheetName);
//     });

//     XLSX.writeFile(wb, `liquor_stock_report_${selectedDate}.xlsx`);
//   };


//   const printReport = () => {
//     const printableContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Menu Report</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//           }
          
//           .report-header {
//             margin-top: 20px;
//             color: black;
//             font-size: 20px;
//             font-weight: bold;
//           }
          
//           .date-range {
//             font-size: 14px;
//             margin: 10px 0;
//           }
          
//           .table-container {
//             margin-top: 20px;
//             width: 90%; /* Adjust width as needed */
//           }
          
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 10px;
//           }
          
//           table, th, td {
//             border: 1px solid black;
//           }
          
//           th, td {
//             padding: 8px;
//             text-align: center;
//           }
          
//           .section-heading {
//             font-size: 18px;
//             font-weight: bold;
//             margin-top: 20px;
//             margin-bottom: 10px;
//           }
          
//           .total-row {
//             background-color: #f2f2f2;
//             font-weight: bold;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="report-header">Liquor Stock Report</div>
//         <div class="date-range">
//           Date Range: ${new Date(selectedDate).toLocaleDateString('en-GB')}
//         </div>
        
//         <!-- Menu Data -->
//         <div class="table-container">
//           <div class="section-heading">Opening Stock</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Brand Name</th>
//                 <th>30</th>
//                 <th>60</th>
//                 <th>90</th>
//                 <th>180</th>
//                 <th>750</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${menuData.map((item) => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQty || '0'}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </div>
        
//         <!-- Purchase Data -->
//         <div class="table-container">
//           <div class="section-heading">Purchase Stock</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Brand Name</th>
//                 <th>30</th>
//                 <th>60</th>
//                 <th>90</th>
//                 <th>180</th>
//                 <th>750</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${purchaseMenuData.map((item) => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQty || '0'}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </div>
        
//         <!-- Sell Data -->
//         <div class="table-container">
//           <div class="section-heading">Sell Data</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Brand Name</th>
//                 <th>30</th>
//                 <th>60</th>
//                 <th>90</th>
//                 <th>180</th>
//                 <th>750</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sellMenuData.map((item) => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('30ml'))?.sellQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('60ml'))?.sellQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('90ml'))?.sellQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('180ml'))?.sellQty || '0'}</td>
//                   <td>${item.childMenus.find(menu => menu.name.endsWith('750ml'))?.sellQty || '0'}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </div>
        
//         <!-- Closing Stock Data -->
//         <div class="table-container">
//           <div class="section-heading">Closing Stock Data</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Brand Name</th>
//                 <th>30</th>
//                 <th>60</th>
//                 <th>90</th>
//                 <th>180</th>
//                 <th>750</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${closingStockData.map((item) => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.closingStock30ml}</td>
//                   <td>${item.closingStock60ml}</td>
//                   <td>${item.closingStock90ml}</td>
//                   <td>${item.closingStock180ml}</td>
//                   <td>${item.closingStock750ml}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </div>
        
//       </body>
//       </html>
//     `;

//     // Open a new window
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) {
//       alert('Please allow pop-ups for this site');
//       return;
//     }

//     // Write content to the new window
//     printWindow.document.write(printableContent);
//     printWindow.document.close();

//     // Print the window
//     printWindow.print();
//   };



//   return (
//     <>
//       <h1 className="text-xl font-bold mb-4 mt-5 text-orange-500 ml-3">Brandwise Stock Report</h1>
//       <div className="flex justify-center items-center font-sans">
//         <label htmlFor="dateInput" className='font-semibold'>Date : </label>
//         <input
//           type="date"
//           id="dateInput"
//           value={selectedDate}
//           onChange={handleDateChange}
//           className="ml-2 h-5 cursor-pointer block w-28 border text-sm border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />

//         <button
//           onClick={printReport}
//           className="ml-4 bg-green-500 text-white px-5 py-2 rounded-md shadow hover:bg-green-600"
//         >
//           Print
//         </button>
//         <button
//           onClick={exportToExcel}
//           className="ml-4 bg-orange-400 text-white px-5 py-2 rounded-md shadow hover:bg-orange-600"
//         >
//           Export To Excel
//         </button>

//       </div>

//       <div id="printable-content">
//         <div className='table-container min-w-fit flex overflow-x-scroll -ml-16 font-sans overflow-y-auto'>
//           <div className="container py-8 mx-20 w-full float-left">
//             <p className="text-base font-bold mb-2 text-right justify-between mr-20 text-gray-800">Opening Stock</p>
//             {Array.isArray(menuData) && menuData.length > 0 ? (
//               <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm -mr-20">
//                 <thead>
//                   <tr className="bg-gray-300">
//                     <th className="px-2 py-2 whitespace-nowrap bg-gray-400 ">Sr No.</th>
//                     <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
//                     <th className="px-4 py-2 border">30ml</th>
//                     <th className="px-4 py-2 border">60ml</th>
//                     <th className="px-4 py-2 border">90ml</th>
//                     <th className="px-4 py-2 border">180ml</th>
//                     <th className="px-4 py-2 border">750ml</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {menuData.map((item, index) => (
//                     <tr key={item.name} className="border-t border-gray-200 font-sans">
//                       <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center ">{index + 1}</td>
//                       <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQty || '0'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>

//           <div className="container mx-auto py-8 w-1/3 float-left font-sans">
//             <p className="text-base font-bold mb-2 text-center ">Purchase</p>
//             {Array.isArray(purchaseMenuData) && purchaseMenuData.length > 1 ? (
//               <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto min-w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="px-4 py-2 border border-gray-300">30ml</th>
//                     <th className="px-4 py-2 border border-gray-300">60ml</th>
//                     <th className="px-4 py-2 border border-gray-300">90ml</th>
//                     <th className="px-4 py-2 border border-gray-300">180ml</th>
//                     <th className="px-4 py-2 border border-gray-300">750ml</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchaseMenuData.map((item) => (
//                     <tr key={item.name} className="border-t border-gray-200 font-sans">
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQty || '0'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>

//           <div className="container mx-auto py-8 w-1/3">
//             <p className="text-base font-bold mb-2 text-center ">Sell</p>
//             {Array.isArray(sellMenuData) && sellMenuData.length > 0 ? (
//               <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto min-w-full text-sm -mr-20">
//                 <thead>
//                   <tr className="bg-gray-300">
//                     <th className="px-4 py-2 border text-center">30ml</th>
//                     <th className="px-4 py-2 border text-center">60ml</th>
//                     <th className="px-4 py-2 border text-center">90ml</th>
//                     <th className="px-4 py-2 border text-center">180ml</th>
//                     <th className="px-4 py-2 border text-center">750ml</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sellMenuData.map((item) => (
//                     <tr key={item.name} className="border-t border-gray-200 font-sans">
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.sellQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.sellQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.sellQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.sellQty || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.sellQty || '0'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>

//           <div className="container py-8 mx-20 w-full float-left">
//             <p className="text-base font-bold mb-2 text-center ">Closing Stock</p>
//             {Array.isArray(closingStockData) ? (
//               <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     {/* <th className="px-4 py-2">Name</th> */}
//                     <th className="px-4 py-2 border text-center">30ml</th>
//                     <th className="px-4 py-2 border text-center">60ml</th>
//                     <th className="px-4 py-2 border text-center">90ml</th>
//                     <th className="px-4 py-2 border text-center">180ml</th>
//                     <th className="px-4 py-2 border text-center">750ml</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {closingStockData.map((item) => (
//                     <tr key={item.name} className="border-t border-gray-200 font-sans">
//                       {/* <td className="px-4 py-2">{item.name}</td> */}
//                       <td className="px-4 py-2 border text-center">{item.closingStock30ml}</td>
//                       <td className="px-4 py-2 border text-center">{item.closingStock60ml}</td>
//                       <td className="px-4 py-2 border text-center">{item.closingStock90ml}</td>
//                       <td className="px-4 py-2 border text-center">{item.closingStock180ml}</td>
//                       <td className="px-4 py-2 border text-center">{item.closingStock750ml}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MenuList;


