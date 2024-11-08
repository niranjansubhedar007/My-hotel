'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import CouponNavbar from '../components/couponNavbar';

const IpSettings = () => {
  const [printerIPCoupon, setPrinterIPCoupon] = useState('');
  const [printerPortCoupon, setPrinterPortCoupon] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [counterAdmins, setCounterAdmins] = useState([]);
  const [savedData, setSavedData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("couponEmployeeAuthToken");
    if (!authToken) {
      router.push("/counterLogin");
    }
  }, []);


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/couponPrinter');
      console.log(response);
      setSavedData(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    }
  };

  useEffect(() => {
    const fetchCounterAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/counteradmin/counteradmins');
        setCounterAdmins(response.data.counterAdmins); // Set the fetched counter admins
      } catch (error) {
        console.error('Error fetching counter admins:', error.message);
        setErrorMessage('Failed to fetch counter admins.');
      }
    };
    fetchCounterAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "printerIPCoupon") setPrinterIPCoupon(value);
    if (name === "printerPortCoupon") setPrinterPortCoupon(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axios.post('http://localhost:5000/printerCoupon', {
        printerIPCoupon: printerIPCoupon, // Sending printer IP correctly
        printerPortCoupon: printerPortCoupon, // Make sure this matches what the server expects
      });
  
      fetchSettings(); // Refresh settings after saving
      setPrinterIPCoupon('');
      setPrinterPortCoupon('');
  
      setShowModal(true); // Show success modal
      setTimeout(() => setShowModal(false), 2000); // Auto-hide the modal
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setErrorMessage('Failed to save settings.');
    }
  };

  const handleCounterAdminLanBillToggleChange = async (counterAdminId, currentStatus) => {
    try {
      const newValue = !currentStatus;
      const response = await axios.patch(`http://localhost:5000/api/counteradmin/counteradmin/${counterAdminId}/lanbill`, {
        islanBill: newValue
      });
  
      if (response.status === 200) {
        setCounterAdmins((prev) => 
          prev.map(counterAdmin => 
            counterAdmin._id === counterAdminId ? { ...counterAdmin, islanBill: newValue } : counterAdmin
          )
        );
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      console.error('Error updating LAN Bill setting for CounterAdmin:', error.message);
      setErrorMessage('Failed to update LAN Bill setting for CounterAdmin.');
    }
  };
  
  return (
    <>
      <CouponNavbar />

      <div className="max-w-5xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg font-sans">
        <form onSubmit={handleFormSubmit} className="mb-4">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">IP and Port Settings</h1>

          {/* KOT Printer */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Printer for Coupon:</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="printerIp" className="block text-sm font-bold text-gray-600">Printer IP:</label>
                <input
                  type="text"
                  id="printerIPCoupon"
                  name="printerIPCoupon"
                  value={printerIPCoupon}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="printerPort" className="block text-sm font-bold text-gray-600">Printer Port:</label>
                <input
                  type="text"
                  id="printerPortCoupon"
                  name="printerPortCoupon"
                  value={printerPortCoupon}
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
                <td className="py-2 px-4 border-b">IP</td>
                <td className="py-2 px-4 border-b">{savedData.printerIPCoupon || 'Not set'}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Port</td>
                <td className="py-2 px-4 border-b">{savedData.printerPortCoupon || 'Not set'}</td>
              </tr>        
            </tbody>
          </table>
        </div>

        <div className="mt-10">
        {counterAdmins.map((counterAdmin) => (
  <div key={counterAdmin._id} className="flex items-center my-2">
    <span className="text-lg font-semibold">LAN Bill</span>
    <button
      onClick={() => handleCounterAdminLanBillToggleChange(counterAdmin._id, counterAdmin.islanBill)}
      className={`ml-4 p-2 rounded-full transition duration-300 ease-in-out ${counterAdmin.islanBill ? 'bg-green-500' : 'bg-red-500'} text-white`}
    >
      <FontAwesomeIcon icon={counterAdmin.islanBill ? faToggleOn : faToggleOff} className="text-2xl" />
    </button>
  </div>
))}
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

export default IpSettings;
