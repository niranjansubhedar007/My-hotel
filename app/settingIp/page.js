// 'use client'
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import { useRouter } from 'next/navigation';

// const IpPortSettings = () => {
//   const [printerIp, setPrinterIp] = useState('');
//   const [printerPort, setPrinterPort] = useState('');
//   const [printerIPBOT, setPrinterIPBOT] = useState('');
//   const [printerPortBOT, setPrinterPortBOT] = useState('');
//   const [printerIPBill, setPrinterIPBill] = useState('');
//   const [printerPortBill, setPrinterPortBill] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [savedData, setSavedData] = useState({});
//   const router = useRouter();

// //   useEffect(() => {
// //     const authToken = localStorage.getItem("EmployeeAuthToken");
// //     if (!authToken) {
// //       router.push("/login");
// //     }
// //   }, []);

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/printerall');
//       setSavedData(response.data);
//     } catch (error) {
//       console.error('Error fetching settings:', error.message);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "printerIp") setPrinterIp(value);
//     if (name === "printerPort") setPrinterPort(value);
//     if (name === "printerIPBOT") setPrinterIPBOT(value);
//     if (name === "printerPortBOT") setPrinterPortBOT(value);
//     if (name === "printerIPBill") setPrinterIPBill(value);
//     if (name === "printerPortBill") setPrinterPortBill(value);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       await axios.post('http://localhost:5000/printer', {
//         printerIP: printerIp,
//         printerPort,
//         printerIPBOT: printerIPBOT,  // Assume you've created state for this
//         printerPortBOT: printerPortBOT, // Assume you've created state for this
//         printerIPBill: printerIPBill, // Assume you've created state for this
//         printerPortBill: printerPortBill // Assume you've created state for this
//       });
  
//       fetchSettings(); // Refresh settings after saving
//       // Clear input fields
//       setPrinterIp('');
//       setPrinterPort('');
//       setPrinterIPBOT(''); // Clear the BOT printer IP
//       setPrinterPortBOT(''); // Clear the BOT printer port
//       setPrinterIPBill(''); // Clear the Bill printer IP
//       setPrinterPortBill(''); // Clear the Bill printer port
  
//       setShowModal(true); // Show success modal
//       setTimeout(() => setShowModal(false), 2000); // Auto-hide the modal
//     } catch (error) {
//       console.error('Error submitting form:', error.message);
//       setErrorMessage('Failed to save settings.'); // Show error message
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-5xl mx-auto mt-20 container shadow-md font-sans">
//         <form onSubmit={handleFormSubmit} className="mb-4 flex items-center ml-3">
//           <div className="text-xl font-semibold font-sans md:mb-0 ">
//             <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-orange-600">IP and Port Settings</h1>

//             <div className="flex items-center space-x-4 mt-4">
//   <label htmlFor="printerKOT" className="block text-xl font-bold text-gray-600 w-1/2">
//     Printer for KOT:
//   </label>
  
//   <div className="w-1/2">
//     <label htmlFor="printerIp" className="block text-sm font-bold text-gray-600">
//       Printer IP:
//     </label>
//     <input
//       type="text"
//       id="printerIp"
//       name="printerIp"
//       value={printerIp}
//       onChange={handleInputChange}
//       className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
//       required
//     />
//   </div>

//   <div className="w-1/2">
//     <label htmlFor="printerPort" className="block text-sm font-bold text-gray-600">
//       Printer Port:
//     </label>
//     <input
//       type="text"
//       id="printerPort"
//       name="printerPort"
//       value={printerPort}
//       onChange={handleInputChange}
//       className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
//       required
//     />
//   </div>
// </div>

// <div className="flex items-center space-x-4 mt-10">
//   <label htmlFor="printerKOT" className="block text-xl font-bold text-gray-600 w-1/2">
//     Printer for BOT:
//   </label>
  
//   <div className="w-1/2">
//     <label htmlFor="printerIp" className="block text-sm font-bold text-gray-600">
//       Printer IP:
//     </label>
//     <input
//       type="text"
//       id="printerIp"
//       name="printerIPBOT"
//       value={printerIPBOT}
//       onChange={handleInputChange}
//       className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
//       required
//     />
//   </div>

//   <div className="w-1/2">
//     <label htmlFor="printerPort" className="block text-sm font-bold text-gray-600">
//       Printer Port:
//     </label>
//     <input
//       type="text"
//       id="printerPort"
//       name="printerPortBOT"
//       value={printerPortBOT}
//       onChange={handleInputChange}
//       className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
//       required
//     />
//   </div>
// </div>

// <div className="flex items-center space-x-4 mt-10">
//   <label htmlFor="printerKOT" className="block text-xl font-bold text-gray-600 w-1/2">
//     Printer for BILL:
//   </label>
  
//   <div className="w-1/2">
//     <label htmlFor="printerIp" className="block text-sm font-bold text-gray-600">
//       Printer IP:
//     </label>
//     <input
//       type="text"
//       id="printerIP"
//       name="printerIPBill"
//       value={printerIPBill}
//       onChange={handleInputChange}
//       className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
//       required
//     />
//   </div>

//   <div className="w-1/2">
//     <label htmlFor="printerPort" className="block text-sm font-bold text-gray-600">
//       Printer Port:
//     </label>
//     <input
//       type="text"
//       id="printerPort"
//       name="printerPortBill"
//       value={printerPortBill}
//       onChange={handleInputChange}
//       className="mt-1 p-0.5 border rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
//       required
//     />
//   </div>
// </div>

//             <div className='flex justify-center mt-4'>
//               <button
//                 type="submit"
//                 className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-64 mx-auto mb-3 lg:ml-96 md:ml-72"
//               >
//                 Save Settings
//               </button>
//             </div>
//           </div>
//         </form>

//         <div className="mt-4">
//   <h2 className="text-lg font-semibold text-gray-700">Saved IPs:</h2>
//   <table className="min-w-full bg-white border border-gray-300">
//     <thead>
//       <tr className="bg-gray-100">
//         <th className="py-2 px-4 border-b text-left">Description</th>
//         <th className="py-2 px-4 border-b text-left">Value</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td className="py-2 px-4 border-b">KOT IP</td>
//         <td className="py-2 px-4 border-b">{savedData.printerIP || 'Not set'}</td>
//       </tr>
//       <tr>
//         <td className="py-2 px-4 border-b">KOT Port</td>
//         <td className="py-2 px-4 border-b">{savedData.printerPort || 'Not set'}</td>
//       </tr>
//       <tr>
//         <td className="py-2 px-4 border-b">BOT IP</td>
//         <td className="py-2 px-4 border-b">{savedData.printerIPBOT || 'Not set'}</td>
//       </tr>
//       <tr>
//         <td className="py-2 px-4 border-b">BOT Port</td>
//         <td className="py-2 px-4 border-b">{savedData.printerPortBOT || 'Not set'}</td>
//       </tr>
//       <tr>
//         <td className="py-2 px-4 border-b">Billing IP</td>
//         <td className="py-2 px-4 border-b">{savedData.printerIPBill || 'Not set'}</td>
//       </tr>
//       <tr>
//         <td className="py-2 px-4 border-b">Billing Port</td>
//         <td className="py-2 px-4 border-b">{savedData.printerPortBill || 'Not set'}</td>
//       </tr>
//     </tbody>
//   </table>
// </div>

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-green-800">Settings saved successfully!</h2>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Modal */}
//         {errorMessage && (
//           <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold text-red-800">{errorMessage}</h2>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default IpPortSettings;



'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

const IpPortSettings = () => {
  const [printerIp, setPrinterIp] = useState('');
  const [printerPort, setPrinterPort] = useState('');
  const [printerIPBOT, setPrinterIPBOT] = useState('');
  const [printerPortBOT, setPrinterPortBOT] = useState('');
  const [printerIPBill, setPrinterIPBill] = useState('');
  const [printerPortBill, setPrinterPortBill] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedData, setSavedData] = useState({});
  const router = useRouter();

    useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/printerall');
      setSavedData(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "printerIp") setPrinterIp(value);
    if (name === "printerPort") setPrinterPort(value);
    if (name === "printerIPBOT") setPrinterIPBOT(value);
    if (name === "printerPortBOT") setPrinterPortBOT(value);
    if (name === "printerIPBill") setPrinterIPBill(value);
    if (name === "printerPortBill") setPrinterPortBill(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/printer', {
        printerIP: printerIp,
        printerPort,
        printerIPBOT,
        printerPortBOT,
        printerIPBill,
        printerPortBill
      });

      fetchSettings(); // Refresh settings after saving
      // Clear input fields
      setPrinterIp('');
      setPrinterPort('');
      setPrinterIPBOT('');
      setPrinterPortBOT('');
      setPrinterIPBill('');
      setPrinterPortBill('');

      setShowModal(true); // Show success modal
      setTimeout(() => setShowModal(false), 2000); // Auto-hide the modal
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setErrorMessage('Failed to save settings.'); // Show error message
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg font-sans">
        <form onSubmit={handleFormSubmit} className="mb-4">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">IP and Port Settings</h1>

          {/* KOT Printer */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Printer for KOT:</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="printerIp" className="block text-sm font-bold text-gray-600">Printer IP:</label>
                <input
                  type="text"
                  id="printerIp"
                  name="printerIp"
                  value={printerIp}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="printerPort" className="block text-sm font-bold text-gray-600">Printer Port:</label>
                <input
                  type="text"
                  id="printerPort"
                  name="printerPort"
                  value={printerPort}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* BOT Printer */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Printer for BOT:</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="printerIPBOT" className="block text-sm font-bold text-gray-600">Printer IP:</label>
                <input
                  type="text"
                  id="printerIPBOT"
                  name="printerIPBOT"
                  value={printerIPBOT}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="printerPortBOT" className="block text-sm font-bold text-gray-600">Printer Port:</label>
                <input
                  type="text"
                  id="printerPortBOT"
                  name="printerPortBOT"
                  value={printerPortBOT}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Billing Printer */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Printer for BILL:</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="printerIPBill" className="block text-sm font-bold text-gray-600">Printer IP:</label>
                <input
                  type="text"
                  id="printerIPBill"
                  name="printerIPBill"
                  value={printerIPBill}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="printerPortBill" className="block text-sm font-bold text-gray-600">Printer Port:</label>
                <input
                  type="text"
                  id="printerPortBill"
                  name="printerPortBill"
                  value={printerPortBill}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full w-full max-w-xs transition duration-200 ease-in-out"
            >
              Save Settings
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Saved IPs:</h2>
          <table className="min-w-full bg-white border border-gray-300 mt-2 rounded-md shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">KOT IP</td>
                <td className="py-2 px-4 border-b">{savedData.printerIP || 'Not set'}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">KOT Port</td>
                <td className="py-2 px-4 border-b">{savedData.printerPort || 'Not set'}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">BOT IP</td>
                <td className="py-2 px-4 border-b">{savedData.printerIPBOT || 'Not set'}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">BOT Port</td>
                <td className="py-2 px-4 border-b">{savedData.printerPortBOT || 'Not set'}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Billing IP</td>
                <td className="py-2 px-4 border-b">{savedData.printerIPBill || 'Not set'}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Billing Port</td>
                <td className="py-2 px-4 border-b">{savedData.printerPortBill || 'Not set'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-800">Settings saved successfully!</h2>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-red-800">{errorMessage}</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IpPortSettings;
