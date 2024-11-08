// "use client"

// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';

// const MenuList = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [purchaseMenuData, setPurchaseMenuData] = useState(null);
//   const [sellMenuData, setSellMenuData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [closingStockData, setClosingStockData] = useState(null);
//   const [closingData, setClosingData] = useState(null);


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

//   const fetchCloseData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/order/stockQty/updateClosing`);
//       const data = await res.json();
//       console.log(data)
//       setClosingData(data);
//     } catch (error) {
//       console.error('Error fetching sell data:', error);
//     }
//   };

//   const fetchCloseStockData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/order/closeStockQty/barmenus`);
//       const data = await res.json();
//       console.log(data)
//       setClosingStockData(data);
//     } catch (error) {
//       console.error('Error fetching sell data:', error);
//     }
//   };


//   useEffect(() => {
//     if (selectedDate) {
//       fetchMenuData();
//       fetchPurchaseData();
//       fetchSellData();
//       fetchCloseStockData()
//     }
//   }, [selectedDate]);

//   useEffect(() => {
//       fetchCloseData()
//   }, []);



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
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQtyStr || '0'}</td>
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

//           <div className="container mx-auto py-8 w-1/3 ml-20">
//             <p className="text-base font-bold mb-2 text-center ">Closing</p>
//             {Array.isArray(closingStockData) && closingStockData.length > 0 ? (
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
//                   {closingStockData.map((item) => (
//                     <tr key={item.name} className="border-t border-gray-200 font-sans">
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQtyStr || '0'}</td>
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





// Hardcode
// "use client"

// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import Navbar from '../components/Navbar';

// const MenuList = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [purchaseMenuData, setPurchaseMenuData] = useState(null);
//   const [sellMenuData, setSellMenuData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [closingStockData, setClosingStockData] = useState(null);
//   const [closingData, setClosingData] = useState(null);

//   useEffect(() => {
//     // Set the selected date to the current date in the format YYYY-MM-DD
//     const currentDate = new Date().toISOString().split('T')[0];
//     console.log(currentDate)
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

//   const fetchCloseData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/order/stockQty/updateClosing`);
//       const data = await res.json();
//       console.log(data)
//       setClosingData(data);
//     } catch (error) {
//       console.error('Error fetching closing data:', error);
//     }
//   };

//   const fetchCloseStockData = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/liquorBrand/order/closeStockQty/barmenus`);
//       const data = await res.json();
//       console.log(data)
//       setClosingStockData(data);
//     } catch (error) {
//       console.error('Error fetching closing stock data:', error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchMenuData();
//       fetchPurchaseData();
//       fetchSellData();
//       fetchCloseStockData();
//     }
//   }, [selectedDate]);

//   useEffect(() => {
//     fetchCloseData();
//   }, []);

//   const handleDateChange = (e) => {
//     console.log(e.target.value)
//     setSelectedDate(e.target.value);
//   };

//   const currentDate = new Date().toISOString().split('T')[0];
//   console.log(currentDate)

//   return (
//     <>
//       <Navbar />
//       <h1 className="text-xl font-bold mb-4 mt-12 text-orange-500 ml-3 font-sans">Brandwise Stock Report</h1>
//       <div className="flex justify-center items-center font-sans -mt-5">
//         <label htmlFor="dateInput" className='font-semibold'>Date : </label>
//         <input
//           type="date"
//           id="dateInput"
//           value={selectedDate}
//           onChange={handleDateChange}
//           className="ml-2 h-5 cursor-pointer block w-28 border text-sm border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className='table-container min-w-fit flex overflow-x-scroll -ml-20 font-sans overflow-y-auto'>
//         <div className="container py-8 mx-20 w-full float-left">
//           <p className="text-base font-bold mb-2 text-right justify-between mr-20 text-gray-800">Opening Stock</p>
//           {Array.isArray(menuData) && menuData.length > 0 ? (
//             <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm -mr-20">
//               <thead>
//                 <tr className="bg-gray-300">
//                   <th className="px-2 py-2 whitespace-nowrap bg-gray-400 ">Sr No.</th>
//                   <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
//                   <th className="px-4 py-2 border">30ml</th>
//                   <th className="px-4 py-2 border">60ml</th>
//                   <th className="px-4 py-2 border">90ml</th>
//                   <th className="px-4 py-2 border">180ml</th>
//                   <th className="px-4 py-2 border">750ml</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {menuData.map((item, index) => (
//                   <tr key={item.name} className="border-t border-gray-200 font-sans">
//                     <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center ">{index + 1}</td>
//                     <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQtyStr || '0'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>

//         <div className="container mx-auto py-8 w-1/3 float-left font-sans">
//           <p className="text-base font-bold mb-2 text-center ">Purchase</p>
//           {Array.isArray(purchaseMenuData) && purchaseMenuData.length > 1 ? (
//             <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto min-w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="px-4 py-2 border border-gray-300">30ml</th>
//                   <th className="px-4 py-2 border border-gray-300">60ml</th>
//                   <th className="px-4 py-2 border border-gray-300">90ml</th>
//                   <th className="px-4 py-2 border border-gray-300">180ml</th>
//                   <th className="px-4 py-2 border border-gray-300">750ml</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {purchaseMenuData.map((item) => (
//                   <tr key={item.name} className="border-t border-gray-200 font-sans">
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQty || '0'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center ">Sell</p>
//           {Array.isArray(sellMenuData) && sellMenuData.length > 0 ? (
//             <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto min-w-full text-sm -mr-20">
//               <thead>
//                 <tr className="bg-gray-300">
//                   <th className="px-4 py-2 border text-center">30ml</th>
//                   <th className="px-4 py-2 border text-center">60ml</th>
//                   <th className="px-4 py-2 border text-center">90ml</th>
//                   <th className="px-4 py-2 border text-center">180ml</th>
//                   <th className="px-4 py-2 border text-center">750ml</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sellMenuData.map((item) => (
//                   <tr key={item.name} className="border-t border-gray-200 font-sans">
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.sellQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.sellQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.sellQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.sellQty || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.sellQty || '0'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>

//         <div className="container mx-auto py-8 w-1/3 ml-20">
//           <p className="text-base font-bold mb-2 text-center ">Closing</p>
//           {selectedDate === currentDate && Array.isArray(closingData) && closingData.length > 0 ? (
//             <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto min-w-full text-sm -mr-20">
//               <thead>
//                 <tr className="bg-gray-300">
//                   <th className="px-4 py-2 border text-center">30ml</th>
//                   <th className="px-4 py-2 border text-center">60ml</th>
//                   <th className="px-4 py-2 border text-center">90ml</th>
//                   <th className="px-4 py-2 border text-center">180ml</th>
//                   <th className="px-4 py-2 border text-center">750ml</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {closingData.map((item) => (
//                   <tr key={item.name} className="border-t border-gray-200 font-sans">
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQtyStr || '0'}</td>
//                     <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQtyStr || '0'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             Array.isArray(closingStockData) && closingStockData.length > 0 ? (
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
//                   {closingStockData.map((item) => (
//                     <tr key={item.name} className="border-t border-gray-200 font-sans">
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('30ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('60ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('90ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('180ml'))?.stockQtyStr || '0'}</td>
//                       <td className="px-4 py-2 border text-center">{item.childMenus.find(menu => menu.name.endsWith('750ml'))?.stockQtyStr || '0'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Loading...</p>
//             )
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MenuList;







// "use client";

// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import Navbar from '../components/Navbar';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUpload } from '@fortawesome/free-solid-svg-icons';

// const MenuList = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [purchaseMenuData, setPurchaseMenuData] = useState(null);
//   const [sellMenuData, setSellMenuData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [closingStockData, setClosingStockData] = useState(null);
//   const [closingData, setClosingData] = useState(null);
//   const [units, setUnits] = useState([]);

//   useEffect(() => {
//     const currentDate = new Date().toISOString().split('T')[0];
//     setSelectedDate(currentDate);
//   }, []);

//   const fetchData = async (url, setter) => {
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       setter(data);
//     } catch (error) {
//       console.error(`Error fetching data from ${url}:`, error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenus?date=${selectedDate}`, setMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenu?date=${selectedDate}`, setPurchaseMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/sellQty?date=${selectedDate}`, setSellMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/closeStockQty/barmenus?date=${selectedDate}`, setClosingStockData);
//     }
//   }, [selectedDate]);

//   useEffect(() => {
//     fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/updateClosing`, setClosingData);
//   }, []);

//   useEffect(() => {
//     if (menuData || purchaseMenuData || sellMenuData) {
//       const allUnits = new Set();

//       const extractUnits = (data) => {
//         if (Array.isArray(data)) {
//           data.forEach(item => {
//             item.childMenus.forEach(menu => {
//               const unit = menu.name.match(/\d+ml$/);
//               if (unit) {
//                 allUnits.add(unit[0]);
//               }
//             });
//           });
//         }
//       };

//       extractUnits(menuData);
//       extractUnits(purchaseMenuData);
//       extractUnits(sellMenuData);

//       setUnits(Array.from(allUnits).sort((a, b) => parseInt(a) - parseInt(b)));
//     }
//   }, [menuData, purchaseMenuData, sellMenuData]);

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };



//   const exportToExcel = () => {
//     const combineData = (data, key) => {
//       if (!Array.isArray(data)) return {};
//       return data.reduce((acc, item) => {
//         if (!acc[item.name]) {
//           acc[item.name] = { 'Brand Name': item.name };
//         }
//         units.forEach(unit => {
//           acc[item.name][`${key} ${unit}`] = item.childMenus.find(menu => menu.name.endsWith(unit))?.stockQtyStr || '0';
//         });
//         return acc;
//       }, {});
//     };

//     const mergeObjects = (target, source) => {
//       for (const key of Object.keys(source)) {
//         if (!target[key]) {
//           target[key] = source[key];
//         } else {
//           Object.assign(target[key], source[key]);
//         }
//       }
//     };

//     const allData = {};

//     if (Array.isArray(menuData)) mergeObjects(allData, combineData(menuData, 'Opening Stock'));
//     if (Array.isArray(purchaseMenuData)) mergeObjects(allData, combineData(purchaseMenuData, 'Purchase'));
//     if (Array.isArray(sellMenuData)) mergeObjects(allData, combineData(sellMenuData, 'Sold'));
//     if (Array.isArray(closingStockData)) mergeObjects(allData, combineData(closingStockData, 'Closing Stock'));
//     if (Array.isArray(closingData)) mergeObjects(allData, combineData(closingData, 'Closing Stock (Current)'));

//     const formattedData = Object.values(allData);

//     // Headers
//     const headers = ['Brand Name',
//       ...units.map(unit => `Opening Stock ${unit}`),
//       ...units.map(unit => `Purchase ${unit}`),
//       ...units.map(unit => `Sold ${unit}`),
//       ...units.map(unit => `Closing Stock ${unit}`)
//     ];

//     const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Stock Report');

//     XLSX.writeFile(wb, `Stock_Report_${selectedDate}.xlsx`);
//   };





//   const renderTable = (data, type, showIndexAndName = false) => {
//     if (!Array.isArray(data) || data.length === 0) return <p>Loading...</p>;

//     return (
//       <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
//         <thead>
//           <tr className="bg-gray-300">
//             {showIndexAndName && (
//               <>
//                 <th className="px-2 py-2 whitespace-nowrap bg-gray-400">Sr No.</th>
//                 <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
//               </>
//             )}
//             {units.map(unit => (
//               <th key={`${type}-${unit}`} className="px-4 py-2 border">{unit}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={item.name} className="border-t border-gray-200 font-sans">
//               {showIndexAndName && (
//                 <>
//                   <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center">{index + 1}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
//                 </>
//               )}
//               {units.map(unit => (
//                 <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
//                   {item.childMenus.find(menu => menu.name.endsWith(unit))?.[type] || '0'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };



//   return (
//     <>
//       <Navbar />
//       <h1 className="text-xl font-bold mb-4 mt-12 text-orange-500 ml-3 font-sans">Brandwise Stock Report</h1>
//       <div className="flex justify-center items-center font-sans -mt-5">
//         <label htmlFor="dateInput" className="font-semibold">Date : </label>
//         <input
//           type="date"
//           id="dateInput"
//           value={selectedDate}
//           onChange={handleDateChange}
//           className="ml-2 h-5 cursor-pointer block w-28 border text-sm border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="flex justify-end mx-3 font-sans">
//         <button
//           onClick={exportToExcel}
//           className="bg-blue-500 text-white px-4 py-1 rounded-md shadow hover:bg-blue-600 focus:outline-none text-sm"
//         >
//           <FontAwesomeIcon icon={faUpload} className="mr-1" />
//           Export to Excel
//         </button>
//       </div>

//       <div className="table-container min-w-fit flex overflow-x-scroll -ml-20 font-sans overflow-y-auto -mt-3">
//         <div className="container py-8 mx-20 w-full float-left">
//           <p className="text-base font-bold mb-2 text-right justify-between mr-20 text-gray-800">Opening Stock (Nos)</p>
//           {renderTable(menuData, 'stockQtyStr', true)}
//         </div>

//         <div className="container mx-auto py-8 w-1/3 float-left font-sans -ml-20">
//           <p className="text-base font-bold mb-2 text-center">Purchase (Nos)</p>
//           {renderTable(purchaseMenuData, 'stockQty')}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center">Sold (Nos)</p>
//           {renderTable(sellMenuData, 'sellQty')}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center">Closing Stock(Nos)</p>
//           {selectedDate === new Date().toISOString().split('T')[0]
//             ? renderTable(closingData, 'stockQtyStr')
//             : renderTable(closingStockData, 'stockQtyStr')}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MenuList;













// "use client";

// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import Navbar from '../components/Navbar';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUpload, faPrint } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';
// import { decode } from 'jsonwebtoken';



// const MenuList = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [purchaseMenuData, setPurchaseMenuData] = useState(null);
//   const [sellMenuData, setSellMenuData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [closingStockData, setClosingStockData] = useState(null);
//   const [closingData, setClosingData] = useState(null);
//   const [units, setUnits] = useState([]);
//   const router = useRouter()

//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//             router.push("/reportLogin");
//         } else {
//             const decodedToken = decode(token);
//             if (!decodedToken || decodedToken.role !== "superAdmin") {
//                 router.push("/reportLogin");
//             }
//         }
//     }, []);


//   useEffect(() => {
//     const currentDate = new Date().toISOString().split('T')[0];
//     setSelectedDate(currentDate);
//   }, []);

//   const fetchData = async (url, setter) => {
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       setter(data);
//     } catch (error) {
//       console.error(`Error fetching data from ${url}:`, error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenus?date=${selectedDate}`, setMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenu?date=${selectedDate}`, setPurchaseMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/sellQty?date=${selectedDate}`, setSellMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/closeStockQty/barmenus?date=${selectedDate}`, setClosingStockData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/updateClosing`, setClosingData);
//     }
//   }, [selectedDate]);

//   useEffect(() => {
//     if (menuData || purchaseMenuData || sellMenuData) {
//       const allUnits = new Set();

//       const extractUnits = (data) => {
//         if (Array.isArray(data)) {
//           data.forEach(item => {
//             item.childMenus.forEach(menu => {
//               const unit = menu.name.match(/\d+ml$/);
//               if (unit) {
//                 allUnits.add(unit[0]);
//               }
//             });
//           });
//         }
//       };

//       extractUnits(menuData);
//       extractUnits(purchaseMenuData);
//       extractUnits(sellMenuData);

//       setUnits(Array.from(allUnits).sort((a, b) => parseInt(a) - parseInt(b)));
//     }
//   }, [menuData, purchaseMenuData, sellMenuData]);

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const exportToExcel = () => {
//     const combineData = (data, key) => {
//       if (!Array.isArray(data)) return {};
//       return data.reduce((acc, item) => {
//         if (!acc[item.name]) {
//           acc[item.name] = { 'Brand Name': item.name };
//         }
//         units.forEach(unit => {
//           acc[item.name][`${key} ${unit}`] = item.childMenus.find(menu => menu.name.endsWith(unit))?.stockQtyStr || '0';
//         });
//         return acc;
//       }, {});
//     };

//     const mergeObjects = (target, source) => {
//       for (const key of Object.keys(source)) {
//         if (!target[key]) {
//           target[key] = source[key];
//         } else {
//           Object.assign(target[key], source[key]);
//         }
//       }
//     };

//     const allData = {};

//     if (Array.isArray(menuData)) mergeObjects(allData, combineData(menuData, 'Opening Stock'));
//     if (Array.isArray(purchaseMenuData)) mergeObjects(allData, combineData(purchaseMenuData, 'Purchase'));
//     if (Array.isArray(sellMenuData)) mergeObjects(allData, combineData(sellMenuData, 'Sold'));
//     if (Array.isArray(closingStockData)) mergeObjects(allData, combineData(closingStockData, 'Closing Stock'));
//     if (Array.isArray(closingData)) mergeObjects(allData, combineData(closingData, 'Closing Stock (Current)'));

//     const formattedData = Object.values(allData);

//     // Headers
//     const headers = ['Brand Name',
//       ...units.map(unit => `Opening Stock ${unit}`),
//       ...units.map(unit => `Purchase ${unit}`),
//       ...units.map(unit => `Sold ${unit}`),
//       ...units.map(unit => `Closing Stock ${unit}`)
//     ];

//     const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Stock Report');

//     XLSX.writeFile(wb, `Stock_Report_${selectedDate}.xlsx`);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const renderTable = (data, type, showIndexAndName = false) => {
//     if (!Array.isArray(data) || data.length === 0) return <p>Loading...</p>;

//     return (
//       <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
//         <thead>
//           <tr className="bg-gray-300">
//             {showIndexAndName && (
//               <>
//                 <th className="px-2 py-2 whitespace-nowrap bg-gray-400">Sr No.</th>
//                 <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
//               </>
//             )}
//             {units.map(unit => (
//               <th key={`${type}-${unit}`} className="px-4 py-2 border">{unit}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={item.name} className="border-t border-gray-200 font-sans">
//               {showIndexAndName && (
//                 <>
//                   <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center">{index + 1}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
//                 </>
//               )}
//               {units.map(unit => (
//                 <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
//                   {item.childMenus.find(menu => menu.name.endsWith(unit))?.[type] || '0'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <h1 className="text-xl font-bold mb-4 mt-12 text-orange-500 ml-3 font-sans">Brandwise Stock Report</h1>
//       <div className="flex justify-center items-center font-sans -mt-5">
//         <label htmlFor="dateInput" className="font-semibold">Date : </label>
//         <input
//           type="date"
//           id="dateInput"
//           value={selectedDate}
//           onChange={handleDateChange}
//           className="ml-2 h-5 cursor-pointer block w-28 border text-sm border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="flex justify-end mx-3 font-sans sticky top-0">
//         <button
//           onClick={exportToExcel}
//           className="bg-blue-500 text-white px-4 py-1 rounded-md shadow hover:bg-blue-600 focus:outline-none text-sm font-semibold"
//         >
//           <FontAwesomeIcon icon={faUpload} className="mr-1" />
//           Export to Excel
//         </button>
//         <button
//           onClick={handlePrint}
//           className="bg-green-500 text-white px-4 py-1 rounded-md shadow hover:bg-green-600 focus:outline-none text-sm ml-2 font-semibold"
//         >
//           <FontAwesomeIcon icon={faPrint} className="mr-1" />
//           Print
//         </button>
//       </div>

//       <div className="table-container min-w-fit flex overflow-x-scroll -ml-20 font-sans overflow-y-auto -mt-3 print-container">
//         <div className="container py-8 mx-20 w-full float-left">
//           <p className="text-base font-bold mb-2 text-right justify-between mr-20 text-gray-800">Opening Stock (Nos)</p>
//           {renderTable(menuData, 'stockQtyStr', true)}
//         </div>

//         <div className="container mx-auto py-8 w-1/3 float-left font-sans -ml-20">
//           <p className="text-base font-bold mb-2 text-center">Purchase (Nos)</p>
//           {renderTable(purchaseMenuData, 'stockQty')}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center">Sold (Nos)</p>
//           {renderTable(sellMenuData, 'sellQty')}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center">Closing Stock(Nos)</p>
//           {selectedDate === new Date().toISOString().split('T')[0]
//             ? renderTable(closingData, 'stockQtyStr')
//             : renderTable(closingStockData, 'stockQtyStr')}
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .print-container, .print-container * {
//             visibility: visible;
//           }
//           .print-container {
//             position: absolute;
//             left: 0;
//             top: 0;
//           }
//           @page {
//             size: A3; /* Adjust the paper size here, e.g., A3, A2, A1, etc. */
//             margin: 10mm;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default MenuList;









// "use client";

// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import Navbar from '../components/Navbar';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUpload, faPrint } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';
// import { decode } from 'jsonwebtoken';

// const MenuList = () => {
//   const [menuData, setMenuData] = useState(null);
//   const [purchaseMenuData, setPurchaseMenuData] = useState(null);
//   const [sellMenuData, setSellMenuData] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [closingStockData, setClosingStockData] = useState(null);
//   const [closingData, setClosingData] = useState(null);
//   const [units, setUnits] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       router.push("/reportLogin");
//     } else {
//       const decodedToken = decode(token);
//       if (!decodedToken || decodedToken.role !== "superAdmin") {
//         router.push("/reportLogin");
//       }
//     }
//   }, [router]);

//   useEffect(() => {
//     const currentDate = new Date().toISOString().split('T')[0];
//     setSelectedDate(currentDate);
//   }, []);

//   const fetchData = async (url, setter) => {
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       setter(data);
//     } catch (error) {
//       console.error(`Error fetching data from ${url}:`, error);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenus?date=${selectedDate}`, setMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenu?date=${selectedDate}`, setPurchaseMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/sellQty?date=${selectedDate}`, setSellMenuData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/closeStockQty/barmenus?date=${selectedDate}`, setClosingStockData);
//       fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/updateClosing`, setClosingData);
//     }
//   }, [selectedDate]);

//   useEffect(() => {
//     if (menuData || purchaseMenuData || sellMenuData) {
//       const allUnits = new Set();

//       const extractUnits = (data) => {
//         if (Array.isArray(data)) {
//           data.forEach(item => {
//             item.childMenus.forEach(menu => {
//               const unit = menu.name.match(/\d+ml$/);
//               if (unit) {
//                 allUnits.add(unit[0]);
//               }
//             });
//           });
//         }
//       };

//       extractUnits(menuData);
//       extractUnits(purchaseMenuData);
//       extractUnits(sellMenuData);

//       setUnits(Array.from(allUnits).sort((a, b) => parseInt(a) - parseInt(b)));
//     }
//   }, [menuData, purchaseMenuData, sellMenuData]);

//   const handleDateChange = (e) => {
//     const selected = e.target.value;
//     const today = new Date().toISOString().split('T')[0];
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const tomorrowDate = tomorrow.toISOString().split('T')[0];

//     if (selected > today && selected >= tomorrowDate) {
//       alert("Selecting tomorrow's date is not allowed.");
//       setSelectedDate(today);
//     } else {
//       setSelectedDate(selected);
//     }
//   };

//   const exportToExcel = () => {
//     const combineData = (data, key) => {
//       if (!Array.isArray(data)) return {};
//       return data.reduce((acc, item) => {
//         if (!acc[item.name]) {
//           acc[item.name] = { 'Brand Name': item.name };
//         }
//         units.forEach(unit => {
//           acc[item.name][`${key} ${unit}`] = item.childMenus.find(menu => menu.name.endsWith(unit))?.stockQtyStr || '0';
//         });
//         return acc;
//       }, {});
//     };

//     const mergeObjects = (target, source) => {
//       for (const key of Object.keys(source)) {
//         if (!target[key]) {
//           target[key] = source[key];
//         } else {
//           Object.assign(target[key], source[key]);
//         }
//       }
//     };

//     const allData = {};

//     if (Array.isArray(menuData)) mergeObjects(allData, combineData(menuData, 'Opening Stock'));
//     if (Array.isArray(purchaseMenuData)) mergeObjects(allData, combineData(purchaseMenuData, 'Purchase'));
//     if (Array.isArray(sellMenuData)) mergeObjects(allData, combineData(sellMenuData, 'Sold'));
//     if (Array.isArray(closingStockData)) mergeObjects(allData, combineData(closingStockData, 'Closing Stock'));
//     if (Array.isArray(closingData)) mergeObjects(allData, combineData(closingData, 'Closing Stock (Current)'));

//     const formattedData = Object.values(allData);

//     // Headers
//     const headers = ['Brand Name',
//       ...units.map(unit => `Opening Stock ${unit}`),
//       ...units.map(unit => `Purchase ${unit}`),
//       ...units.map(unit => `Sold ${unit}`),
//       ...units.map(unit => `Closing Stock ${unit}`)
//     ];

//     const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Stock Report');

//     XLSX.writeFile(wb, `Stock_Report_${selectedDate}.xlsx`);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const renderTable = (data, type, showIndexAndName = false) => {
//     if (!Array.isArray(data) || data.length === 0) return <p>Loading...</p>;

//     return (
//       <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
//         <thead>
//           <tr className="bg-gray-300">
//             {showIndexAndName && (
//               <>
//                 <th className="px-2 py-2 whitespace-nowrap bg-gray-400">Sr No.</th>
//                 <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
//               </>
//             )}
//             {units.map(unit => (
//               <th key={`${type}-${unit}`} className="px-4 py-2 border">{unit}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={item.name} className="border-t border-gray-200 font-sans">
//               {showIndexAndName && (
//                 <>
//                   <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center">{index + 1}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
//                 </>
//               )}
//               {units.map(unit => (
//                 <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
//                   {item.childMenus.find(menu => menu.name.endsWith(unit))?.[type] || '0'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <h1 className="text-xl font-bold mb-4 mt-12 text-orange-500 ml-3 font-sans">Brandwise Stock Report</h1>
//       <div className="flex justify-center items-center font-sans -mt-5">
//         <label htmlFor="dateInput" className="font-semibold">Date : </label>
//         <input
//           type="date"
//           id="dateInput"
//           value={selectedDate}
//           onChange={handleDateChange}
//           className="ml-2 h-5 cursor-pointer block w-28 border text-sm border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         />
//       </div>

//       <div className="flex justify-end mx-3 font-sans sticky top-0">
//         <button
//           onClick={exportToExcel}
//           className="bg-blue-500 text-white px-4 py-1 rounded-md shadow hover:bg-blue-600 focus:outline-none text-sm font-semibold"
//         >
//           <FontAwesomeIcon icon={faUpload} className="mr-1" />
//           Export to Excel
//         </button>
//         <button
//           onClick={handlePrint}
//           className="bg-green-500 text-white px-4 py-1 rounded-md shadow hover:bg-green-600 focus:outline-none text-sm ml-2 font-semibold"
//         >
//           <FontAwesomeIcon icon={faPrint} className="mr-1" />
//           Print
//         </button>
//       </div>

//       <div className="table-container min-w-fit flex overflow-x-scroll -ml-20 font-sans overflow-y-auto -mt-3 print-container">
//         <div className="container py-8 mx-20 w-full float-left">
//           <p className="text-base font-bold mb-2 text-right justify-between mr-20 text-gray-800">Opening Stock (Nos)</p>
//           {renderTable(menuData, 'stockQtyStr', true)}
//         </div>

//         <div className="container mx-auto py-8 w-1/3 float-left font-sans -ml-20">
//           <p className="text-base font-bold mb-2 text-center">Purchase (Nos)</p>
//           {renderTable(purchaseMenuData, 'stockQty')}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center">Sold (Nos)</p>
//           {renderTable(sellMenuData, 'sellQty')}
//         </div>

//         <div className="container mx-auto py-8 w-1/3">
//           <p className="text-base font-bold mb-2 text-center">Closing Stock(Nos)</p>
//           {selectedDate === new Date().toISOString().split('T')[0]
//             ? renderTable(closingData, 'stockQtyStr')
//             : renderTable(closingStockData, 'stockQtyStr')}
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .print-container, .print-container * {
//             visibility: visible;
//           }
//           .print-container {
//             position: absolute;
//             left: 0;
//             top: 0;
//           }
//           @page {
//             size: A3; /* Adjust the paper size here, e.g., A3, A2, A1, etc. */
//             margin: 10mm;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default MenuList;











"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { decode } from 'jsonwebtoken';

const MenuList = () => {
  const [menuData, setMenuData] = useState(null);
  const [purchaseMenuData, setPurchaseMenuData] = useState(null);
  const [sellMenuData, setSellMenuData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [closingStockData, setClosingStockData] = useState(null);
  const [closingData, setClosingData] = useState(null);
  const [units, setUnits] = useState([]);
  const router = useRouter();

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
  }, [router]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedDate(currentDate);
  }, []);

  const fetchData = async (url, setter) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenus?date=${selectedDate}`, setMenuData);
      fetchData(`http://localhost:5000/api/liquorBrand/stockQty/barmenu?date=${selectedDate}`, setPurchaseMenuData);
      fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/sellQty?date=${selectedDate}`, setSellMenuData);
      fetchData(`http://localhost:5000/api/liquorBrand/order/closeStockQty/barmenus?date=${selectedDate}`, setClosingStockData);
      fetchData(`http://localhost:5000/api/liquorBrand/order/stockQty/updateClosing`, setClosingData);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (menuData || purchaseMenuData || sellMenuData) {
      const allUnits = new Set();

      const extractUnits = (data) => {
        if (Array.isArray(data)) {
          data.forEach(item => {
            item.childMenus.forEach(menu => {
              const unit = menu.name.match(/\d+ml$/);
              if (unit) {
                allUnits.add(unit[0]);
              }
            });
          });
        }
      };

      extractUnits(menuData);
      extractUnits(purchaseMenuData);
      extractUnits(sellMenuData);

      setUnits(Array.from(allUnits).sort((a, b) => parseInt(a) - parseInt(b)));
    }
  }, [menuData, purchaseMenuData, sellMenuData]);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    if (selected > today && selected >= tomorrowDate) {
      alert("You cant select tomorrow's date !");
      setSelectedDate(today);
    } else {
      setSelectedDate(selected);
    }
  };

  const exportToExcel = () => {
    const combineData = (data, key) => {
      if (!Array.isArray(data)) return {};
      return data.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = { 'Brand Name': item.name };
        }
        units.forEach(unit => {
          acc[item.name][`${key} ${unit}`] = item.childMenus.find(menu => menu.name.endsWith(unit))?.stockQtyStr || '0';
        });
        return acc;
      }, {});
    };

    const mergeObjects = (target, source) => {
      for (const key of Object.keys(source)) {
        if (!target[key]) {
          target[key] = source[key];
        } else {
          Object.assign(target[key], source[key]);
        }
      }
    };

    const allData = {};

    if (Array.isArray(menuData)) mergeObjects(allData, combineData(menuData, 'Opening Stock'));
    if (Array.isArray(purchaseMenuData)) mergeObjects(allData, combineData(purchaseMenuData, 'Purchase'));
    if (Array.isArray(sellMenuData)) mergeObjects(allData, combineData(sellMenuData, 'Sold'));
    if (Array.isArray(closingStockData)) mergeObjects(allData, combineData(closingStockData, 'Closing Stock'));
    if (Array.isArray(closingData)) mergeObjects(allData, combineData(closingData, 'Closing Stock (Current)'));

    const formattedData = Object.values(allData);

    // Headers
    const headers = ['Brand Name',
      ...units.map(unit => `Opening Stock ${unit}`),
      ...units.map(unit => `Purchase ${unit}`),
      ...units.map(unit => `Sold ${unit}`),
      ...units.map(unit => `Closing Stock ${unit}`)
    ];

    const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Report');

    XLSX.writeFile(wb, `Stock_Report_${selectedDate}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  // const renderTable = (data, type, showIndexAndName = false) => {
  //   if (!Array.isArray(data) || data.length === 0) return <p>Loading...</p>;

  //   return (
  //     <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
  //       <thead>
  //         <tr className="bg-gray-300">
  //           {showIndexAndName && (
  //             <>
  //               <th className="px-2 py-2 whitespace-nowrap bg-gray-400">Sr No.</th>
  //               <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
  //             </>
  //           )}
  //           {units.map(unit => (
  //             <th key={`${type}-${unit}`} className="px-4 py-2 border">{unit}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data.map((item, index) => (
  //           <tr key={item.name} className="border-t border-gray-200 font-sans">
  //             {showIndexAndName && (
  //               <>
  //                 <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center">{index + 1}</td>
  //                 <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
  //               </>
  //             )}
  //             {units.map(unit => (
  //               <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
  //                 {type === 'sellQty'
  //                   ? (item.childMenus.find(menu => menu.name.endsWith(unit))?.sellQty || 0) / parseInt(unit)
  //                   : item.childMenus.find(menu => menu.name.endsWith(unit))?.[type] || '0'}
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // };


  // const renderTable = (data, type, showIndexAndName = false) => {
  //   if (!Array.isArray(data) || data.length === 0) return <p>Loading...</p>;
  
  //   return (
  //     <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
  //       <thead>
  //         <tr className="bg-gray-300">
  //           {showIndexAndName && (
  //             <>
  //               <th className="px-2 py-2 whitespace-nowrap bg-gray-400">Sr No.</th>
  //               <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
  //             </>
  //           )}
  //           {units.map(unit => (
  //             <th key={`${type}-${unit}`} className="px-4 py-2 border">{unit}</th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {data.map((item, index) => (
  //           <tr key={item.name} className="border-t border-gray-200 font-sans">
  //             {showIndexAndName && (
  //               <>
  //                 <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center">{index + 1}</td>
  //                 <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
  //               </>
  //             )}
  //             {units.map(unit => {
  //               const sellQty = item.childMenus.find(menu => menu.name.endsWith(unit))?.sellQty;
  //               if (type === 'sellQty' && sellQty !== undefined) {
  //                 const bottles = Math.floor(sellQty / parseInt(unit));
  //                 const remainder = sellQty % parseInt(unit);
  //                 return (
  //                   <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
  //                     {bottles === 0 ? '0' : `${bottles}.${remainder}`}
  //                   </td>
  //                 );
  //               } else {
  //                 return (
  //                   <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
  //                     {item.childMenus.find(menu => menu.name.endsWith(unit))?.[type] || '0'}
  //                   </td>
  //                 );
  //               }
  //             })}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // };


  const renderTable = (data, type, showIndexAndName = false) => {
    if (!Array.isArray(data) || data.length === 0) return <p>Loading...</p>;
  
    return (
      <table className="w-full border-collapse border border-gray-200 font-sans overflow-x-auto text-sm">
        <thead>
          <tr className="bg-gray-300">
            {showIndexAndName && (
              <>
                <th className="px-2 py-2 whitespace-nowrap bg-gray-400">Sr No.</th>
                <th className="mx-14 py-2 px-10 border bg-gray-400">Brand Name</th>
              </>
            )}
            {units.map(unit => (
              <th key={`${type}-${unit}`} className="px-4 py-2 border">{unit}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.name} className="border-t border-gray-200 font-sans">
              {showIndexAndName && (
                <>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100 text-center">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold border border-gray-300 bg-gray-100">{item.name}</td>
                </>
              )}
              {units.map(unit => {
                const sellQty = item.childMenus.find(menu => menu.name.endsWith(unit))?.sellQty;
                if (type === 'sellQty' && sellQty !== undefined) {
                  const bottles = Math.floor(sellQty / parseInt(unit));
                  const remainder = sellQty % parseInt(unit);
                  const formattedSellQty = remainder === 0 ? `${bottles}` : `${bottles}.${remainder}`;
                  return (
                    <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
                      {formattedSellQty}
                    </td>
                  );
                } else {
                  return (
                    <td key={`${type}-${unit}-${index}`} className="px-4 py-2 border text-center">
                      {item.childMenus.find(menu => menu.name.endsWith(unit))?.[type] || '0'}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  

  return (
    <>
      <Navbar />
      <h1 className="text-xl font-bold mb-4 mt-12 text-orange-500 ml-3 font-sans">Brandwise Stock Report</h1>
      <div className="flex justify-center items-center font-sans -mt-5">
        <label htmlFor="dateInput" className="font-semibold">Date : </label>
        <input
          type="date"
          id="dateInput"
          value={selectedDate}
          onChange={handleDateChange}
          className="ml-2 h-5 cursor-pointer block w-28 border text-sm border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="flex justify-end mx-3 font-sans sticky top-0">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-1 rounded-md shadow hover:bg-blue-600 focus:outline-none text-sm font-semibold"
        >
          <FontAwesomeIcon icon={faUpload} className="mr-1" />
          Export to Excel
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-4 py-1 rounded-md shadow hover:bg-green-600 focus:outline-none text-sm ml-2 font-semibold"
        >
          <FontAwesomeIcon icon={faPrint} className="mr-1" />
          Print
        </button>
      </div>

      <div className="table-container min-w-fit flex overflow-x-scroll -ml-20 font-sans overflow-y-auto -mt-3 print-container">
        <div className="container py-8 mx-20 w-full float-left">
          <p className="text-base font-bold mb-2 text-right justify-between mr-20 text-gray-800">Opening Stock (Nos)</p>
          {renderTable(menuData, 'stockQtyStr', true)}
        </div>

        <div className="container mx-auto py-8 w-1/3 float-left font-sans -ml-20">
          <p className="text-base font-bold mb-2 text-center">Purchase (Nos)</p>
          {renderTable(purchaseMenuData, 'stockQty')}
        </div>

        <div className="container mx-auto py-8 w-1/3">
          <p className="text-base font-bold mb-2 text-center">Sold (Nos)</p>
          {renderTable(sellMenuData, 'sellQty')}
        </div>

        <div className="container mx-auto py-8 w-1/3">
          <p className="text-base font-bold mb-2 text-center">Closing Stock(Nos)</p>
          {selectedDate === new Date().toISOString().split('T')[0]
            ? renderTable(closingData, 'stockQtyStr')
            : renderTable(closingStockData, 'stockQtyStr')}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
          }
          @page {
            size: A3; /* Adjust the paper size here, e.g., A3, A2, A1, etc. */
            margin: 10mm;
          }
        }
      `}</style>
    </>
  );
};

export default MenuList;
