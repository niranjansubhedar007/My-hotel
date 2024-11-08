"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PaymentModal from "../payment/page";
import Try from "../test/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleMinus,
  faTimes,
  faTableColumns,
  faObjectUngroup,
  faHouse,
  faObjectGroup,
  faAngleUp,
  faAngleDown,
  faLeftRight,
  faDiagramNext,
  faDiagramPredecessor,
  faArrowsSplitUpAndLeft,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import OrderSidebar from "../components/orderSidebar";

const Billing = ({ tableId, acPercentage }) => {
  const [categories, setCategories] = useState([]);
  const [barCategories, setBarCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [barMenus, setBarMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBarCategory, setSelectedBarCategory] = useState(null);
  const [selectedBarMenuItem, setSelectedBarMenuItem] = useState(null);
  const [selectedBrandMenuItem, setSelectedBrandMenuItem] = useState(null);
  const [showBarMenus, setShowBarMenus] = useState(true);
  const [showBrandMenus, setShowBrandMenus] = useState(true);
  const [showBrandCategoryMenus, setShowBrandCategoryMenus] = useState(true);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [tableInfo, setTableInfo] = useState(null); // New state for table information
  const [hotelInfo, setHotelInfo] = useState(null); // New state for hotel information
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null); // Create a ref for the search input element
  const menuItemRefs = useRef([]);
  const router = useRouter();
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [isVATEnabled, setIsVATEnabled] = useState(true); // State for enabling/disabling GST
  const [selectedOrder, setSelectedOrder] = useState(null); // Add selectedOrder state
  const [tableNames, setTableNames] = useState({});
  const [orderNumber, setOrderNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [tastes, setTastes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTastes, setSelectedTastes] = useState({});
  const [newTastes, setNewTastes] = useState({});
  const [lastAllOrders, setLastAllOrders] = useState([]);
  const [isCloseTablesModalOpen, setIsCloseTablesModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenuNames, setSelectedMenuNames] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [sections, setSections] = useState([]); // Add state for sections
  const [sectionId, setSectionId] = useState(""); // Add state to track the selected section for creating tables
  const [sectionName, setSectionName] = useState(""); // Add state to track the selected section for creating tables
  const [destinationTableId, setDestinationTableId] = useState("");
  const [sourceTableId, setSourceTableId] = useState("");
  const [mainTableName, setMainTableName] = useState("");
  const [numberOfSubtablesToShow, setNumberOfSubtablesToShow] = useState("");
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isDirectState, setIsDirectState] = useState([]); // State to store isDirect values
  const [isDirectValues, setIsDirectValues] = useState([]); // State to store isDirect values
  const [isLanState, setIsLanState] = useState(null);
  const [isLanBillState, setIsLanBillState] = useState(null); // New state for lanBill
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreTableName, setRestoreTableName] = useState("");
  const [showCategoryMenus, setShowCategoryMenus] = useState(true);
  const [showBarCategoryMenus, setShowBarCategoryMenus] = useState(true);
  const [waiterName, setWaiterName] = useState("");
  const [waitersList, setWaitersList] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedOptionForBar, setSelectedOptionForBar] = useState(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [errorMessageMerge, setErrorMessageMerge] = useState("");
  const [isErrorModalOpenMerge, setIsErrorModalOpenMerge] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [sourceSectionId, setSourceSectionId] = useState("");
  const [destinationSectionId, setDestinationSectionId] = useState("");
  const [isListening, setIsListening] = useState(false); // For speech recognition state
  const [isCancelKotModalOpen, setIsCancelKotModalOpen] = useState(false);
  const [quantitiesToCancel, setQuantitiesToCancel] = useState({});

  const handleQuantityChanged = (itemName, value) => {
    const quantity = parseInt(value, 10);
    if (quantity >= 0) {
      setQuantitiesToCancel((prev) => ({
        ...prev,
        [itemName]: quantity,
      }));
    }
  };

  const handleToggleButton = () => {
    setShowMore(!showMore);
  };

  // const SpeechRecognition =
  //   typeof window !== "undefined" &&
  //   (window.SpeechRecognition || window.webkitSpeechRecognition);

  // const startListening = () => {
  //   if (SpeechRecognition) {
  //     const recognition = new SpeechRecognition();
  //     recognition.lang = 'en-US';
  //     recognition.interimResults = false;
  //     recognition.maxAlternatives = 1;

  //     recognition.onresult = (event) => {
  //       const speechResult = event.results[0][0].transcript.toLowerCase().trim();
  //       console.log("Speech recognized:", speechResult);

  //       // Parse the speech result to extract quantity and menu name
  //       const quantityMatch = speechResult.match(/add (one|two|three) (.+)/);
  //       if (quantityMatch) {
  //         const quantityMapping = { 'one': 1, 'two': 2, 'three': 3 };
  //         const quantity = quantityMapping[quantityMatch[1]];
  //         const menuName = quantityMatch[2].trim();

  //         // Find the menu item by name
  //         const menuItem = menus.find(menu => menu.name.toLowerCase() === menuName.toLowerCase());
  //         if (menuItem) {
  //           // Add the item to the order
  //           addToOrder({ ...menuItem, quantity });
  //         } else {
  //           console.log(`Menu item "${menuName}" not found.`);
  //         }
  //       } else {
  //         console.log("No valid command found in speech.");
  //       }
  //     };

  //     recognition.onerror = (event) => {
  //       console.error("Speech recognition error:", event.error);
  //       // Optionally, restart listening if an error occurs
  //       setTimeout(() => {
  //         startListening();
  //       }, 1000); // Retry after 1 second
  //     };

  //     recognition.onend = () => {
  //       setIsListening(false);
  //       // Automatically restart listening after completion
  //       startListening();
  //     };

  //     try {
  //       recognition.start();
  //       setIsListening(true);
  //     } catch (error) {
  //       console.error("Failed to start speech recognition:", error);
  //       setIsListening(false);
  //     }
  //   } else {
  //     console.log("Speech Recognition API is not supported in this browser.");
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem("EmployeeAuthToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const handleParentMenuSelect = (event) => {
    const selectedParentId = event.target.value;
    setSelectedParentId(selectedParentId); // Set state

    // Update state holding the selectedParentId
    setSelectedOptionForBar(selectedParentId);

    // Retrieve existing parent IDs and menu items from local storage
    const existingParentIds =
      JSON.parse(localStorage.getItem("selectedParentIds")) || [];
    const existingMenusList =
      JSON.parse(localStorage.getItem("selectedMenusList")) || [];

    // Add the selected parent ID if it's not already in the array
    if (!existingParentIds.includes(selectedParentId)) {
      existingParentIds.push(selectedParentId);
      existingMenusList.push([]); // Initialize corresponding menu list only for new parent IDs
    }

    // Store the updated arrays in local storage
    localStorage.setItem(
      "selectedParentIds",
      JSON.stringify(existingParentIds)
    );
    localStorage.setItem(
      "selectedMenusList",
      JSON.stringify(existingMenusList)
    );

    // Update selected items (if necessary)
    const selectedValue = event.target.options[event.target.selectedIndex].text;
    const existingItems =
      JSON.parse(localStorage.getItem("selectedItems")) || [];
    const itemIndex = existingItems.findIndex(
      (item) =>
        item.name === selectedValue && item.parentId === selectedParentId
    );

    if (itemIndex === -1) {
      existingItems.push({
        name: selectedValue,
        parentId: selectedParentId,
        quantity: 0, // Initialize quantity if needed
      });
    }

    // Store the updated array in local storage
    localStorage.setItem("selectedItems", JSON.stringify(existingItems));
  };

  // useEffect(() => {
  //   // Declare the fetchAdmins function inside useEffect
  //   const fetchAdmins = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:5000/api/auth/admins"
  //       );
  //       const combinedAdmins = response.data.admins.concat(
  //         response.data.adminBars
  //       );

  //       setIsDirectState(combinedAdmins[0].isDirect); // Set the state with isDirect values
  //     } catch (error) {
  //       console.error("Error fetching admins:", error.message);
  //       setErrorMessage("Failed to fetch admins.");
  //     }
  //   };

  //   // Call fetchAdmins inside the useEffect hook
  //   fetchAdmins();
  // }, []); // Empty dependency array means this runs once when the component mounts

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/admins"
        );
        const combinedAdmins = response.data.admins.concat(
          response.data.adminBars
        );

        // Set isDirect, isLan, and lanBill states from the first combined admin
        setIsDirectState(combinedAdmins[0].isDirect);
        setIsLanState(combinedAdmins[0].isLan);
        setIsLanBillState(combinedAdmins[0].islanBill); // Set the lanBill state
      } catch (error) {
        console.error("Error fetching admins:", error.message);
        setErrorMessage("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    setSelectedOptionForBar(null);
  }, [selectedBarMenuItem, selectedBrandMenuItem]);

  const handleClickBarMenuItem = (product) => {
    setSelectedBarMenuItem(product);
    setShowBarMenus(false);
  };

  const handleClickBrandMenuItem = (product) => {
    // console.log(product);
    setSelectedBrandMenuItem(product);
    setShowBrandCategoryMenus(false);
    // setShowBarMenus(false);
    setShowBrandMenus(true);
    // setShowBrands(true)
  };

  const handleResetTable = async (sectionName, mainTableName) => {
    try {
      // Call the API to get the tableId for the mainTableName
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/bySection/${sectionName}/${mainTableName}`
      );
      // console.log(tableResponse);
      const mainTableId = tableResponse.data._id;

      // Check if mainTableId is obtained successfully
      if (!mainTableId) {
        console.error("Main table ID not found");
        return;
      }

      const sectionResponse = await axios.get(
        `http://localhost:5000/api/table/section/byName/${sectionName}`
      );
      // console.log(sectionResponse);
      const sectionId = sectionResponse.data.sectionId;

      // Check if sectionId is obtained successfully
      if (!sectionId) {
        console.error("Section ID not found");
        return;
      }

      // Call the reset-subtables endpoint with the retrieved mainTableId and sectionId
      const response = await axios.put(
        `http://localhost:5000/api/table/${sectionId}/${mainTableId}/reset-subtables`
      );

      if (response.status === 200) {
        // Handle success
        console.log(response.data.message);
        setIsRestoreModalOpen(false);
        setSectionName("");
        setMainTableName("");
      } else {
        // Handle errors
        console.error("Failed to reset subtables");
      }
    } catch (error) {
      console.error("Error resetting subtables:", error);
    }
  };

  const handleShowSubmit = async (
    sectionName,
    mainTableName,
    numberOfSubtablesToShow
  ) => {
    try {
      // Call the API to get the tableId for the mainTableName
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/bySection/${sectionName}/${mainTableName}`
      );
      console.log(tableResponse);
      const mainTableId = tableResponse.data._id;

      // Check if mainTableId is obtained successfully
      if (!mainTableId) {
        console.error("Main table ID not found");
        return;
      }

      const sectionResponse = await axios.get(
        `http://localhost:5000/api/table/section/byName/${sectionName}`
      );
      console.log(sectionResponse);
      const sectionId = sectionResponse.data.sectionId;

      // Check if sectionId is obtained successfully
      if (!sectionId) {
        console.error("Section ID not found");
        return;
      }

      // Call the show-subtables endpoint with the retrieved mainTableId and numberOfSubtablesToShow
      const response = await axios.put(
        `http://localhost:5000/api/table/${sectionId}/${mainTableId}/show-subtables`,
        {
          numberOfSubtablesToShow: parseInt(numberOfSubtablesToShow),
        }
      );

      if (response.status === 200) {
        // Handle success
        console.log(response.data.message);
        setIsShowModalOpen(false);
        setMainTableName("");
        setNumberOfSubtablesToShow("");
        setSectionName("");
      } else {
        // Handle errors
        console.error("Failed to update subtables");
      }
    } catch (error) {
      console.error("Error showing subtables:", error);
    }
  };

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  const handleCancelKOTLan = async () => {
    try {
      console.log("Selected menu names to cancel:", selectedMenuNames);

      if (selectedMenuNames.length === 0) {
        console.log("No items selected to cancel.");
        return;
      }

      const kotItems = [];
      const botItems = [];

      for (const selectedItemName of selectedMenuNames) {
        const selectedItem = currentOrder.find(
          (item) => item.name === selectedItemName
        );

        if (!selectedItem) {
          console.error(`Item ${selectedItemName} not found in current order`);
          continue;
        }

        const quantityToCancel = quantitiesToCancel[selectedItemName] || 0;

        if (quantityToCancel <= 0) {
          console.log(`Invalid quantity to cancel for ${selectedItemName}`);
          continue;
        }

        // Updated condition based on 'barCategory'
        if (selectedItem.barCategory) {
          // Check if 'barCategory' exists
          botItems.push({
            name: selectedItemName,
            quantity: quantityToCancel,
          });
        } else {
          kotItems.push({
            name: selectedItemName,
            quantity: quantityToCancel,
          });
        }

        await axios.patch(`http://localhost:5000/api/kot/${tableId}`, {
          menuName: selectedItemName,
          quantityToCancel: quantityToCancel,
        });

        const updatedQuantity = selectedItem.quantity - quantityToCancel;

        if (updatedQuantity <= 0) {
          removeItemFromLocalStorage(tableId, selectedItemName);
        }
      }

      const updatedOrder = currentOrder.filter(
        (orderItem) =>
          !selectedMenuNames.includes(orderItem.name) ||
          orderItem.quantity > quantitiesToCancel[orderItem.name]
      );

      setCurrentOrder(updatedOrder);
      setSelectedMenuNames([]);
      setQuantitiesToCancel({});

      const generateCancelKOTContent = (
        itemsToCancel,
        tableInfo,
        waiterName
      ) => {
        const lineWidth = 40; // Adjust line width to your needs
        const columnWidths = { name: 32, quantity: 1 };

        // Center a line of text by adding spaces before it
        const centerText = (text) => {
          const padding = Math.floor((lineWidth - text.length) / 2);
          return " ".repeat(padding > 0 ? padding : 0) + text;
        };

        // Left-align a line of text
        const leftAlignText = (text) => {
          return text.padEnd(lineWidth); // Ensures the text is aligned to the left
        };

        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        const formattedTime = `${String(formattedHours).padStart(
          2,
          "0"
        )}:${minutes} ${period}`;

        // Escape characters for bold (assuming your printer supports it)
        const ESC = "\x1b"; // ESC character
        const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
        const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off

        // ESC/POS commands for font size
        const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
        const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

        // Start building the content
        let content = `${DOUBLE_SIZE_ON}${"Cancel KOT"}${NORMAL_SIZE}\n\n`;

        // Left-align the Table and Waiter line
        content += `${leftAlignText(
          `Table: ${tableInfo?.tableName || "N/A"}                 Waiter: ${
            waiterName || ""
          }`
        )}\n`;

        // Center the date and time information
        content += `${leftAlignText(
          `Date: ${formattedDate}        Time: ${formattedTime}`
        )}\n`;

        // Create a table for item and quantity
        const tableWidth = columnWidths.name + columnWidths.quantity + 7;
        const borderLine = "-".repeat(tableWidth);
        const headerText = ` ${BOLD_ON}${"Item".padEnd(
          columnWidths.name
        )} Qty${BOLD_OFF}`;

        content += `${borderLine}\n${headerText}\n${borderLine}\n`;

        // Process each canceled item
        itemsToCancel.forEach((item) => {
          const itemText = ` ${item.name.padEnd(columnWidths.name)}  ${
            item.quantity
          }`;
          content += `${BOLD_ON}${leftAlignText(itemText)}${BOLD_OFF}\n`;
        });

        content += `${borderLine}\n`;

        return content;
      };

      // BOT content generation for canceled items
      const generateCancelBOTContent = (
        itemsToCancel,
        tableInfo,
        waiterName
      ) => {
        let content = generateCancelKOTContent(
          itemsToCancel,
          tableInfo,
          waiterName
        );
        content = content.replace("Cancel KOT", "Cancel BOT"); // Modify heading for BOT content
        return content;
      };

      // Print KOT items on KOT printer
      if (kotItems.length > 0) {
        const kotContent = generateCancelKOTContent(
          kotItems,
          tableInfo,
          waiterName
        );
        await axios.post("http://localhost:5000/print-kot", { kotContent }); // Send to KOT printer endpoint
      }

      // Print BOT items on BOT printer
      if (botItems.length > 0) {
        const botContent = generateCancelBOTContent(
          botItems,
          tableInfo,
          waiterName
        );
        await axios.post("http://localhost:5000/print-bot", { botContent }); // Send to BOT printer endpoint
      }

      console.log(
        "KOT/BOT canceled and sent to respective printers successfully."
      );
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling KOT/BOT:", error);
    }
  };

  const handleCancelKOT = async () => {
    try {
      console.log("Selected menu names to cancel:", selectedMenuNames);

      if (selectedMenuNames.length === 0) {
        console.log("No items selected to cancel.");
        // Handle the "Greet already exists" error from the backend
        setIsCancelKotModalOpen("Please select items for cancel KOT/BOT."); // Show specific error message
        setIsCancelKotModalOpen(true); // Open the timer popup
        setTimeout(() => {
          setIsCancelKotModalOpen(false); // Close the popup after 3 seconds
        }, 3000);
        return;
      }

      for (const selectedItemName of selectedMenuNames) {
        const selectedItem = currentOrder.find(
          (item) => item.name === selectedItemName
        );

        if (!selectedItem) {
          console.error(`Item ${selectedItemName} not found in current order`);
          continue;
        }

        // Get the quantity to cancel specified by the user
        const quantityToCancel = quantitiesToCancel[selectedItemName] || 0;

        if (quantityToCancel <= 0) {
          console.log(`Invalid quantity to cancel for ${selectedItemName}`);
          continue;
        }

        // Patch request to cancel the selected menu item
        await axios.patch(`http://localhost:5000/api/kot/${tableId}`, {
          menuName: selectedItemName,
          quantityToCancel: quantityToCancel, // Use the user-specified quantity
        });

        // Update the current order
        const updatedQuantity = selectedItem.quantity - quantityToCancel;

        // If quantity becomes zero, remove the item from the order
        if (updatedQuantity <= 0) {
          removeItemFromLocalStorage(tableId, selectedItemName);
        } else {
          // Otherwise, update the quantity in localStorage
          // updateItemQuantityInLocalStorage(tableId, selectedItemName, updatedQuantity);
        }
      }

      // Filter out items that were fully canceled
      const updatedOrder = currentOrder.filter(
        (orderItem) =>
          !selectedMenuNames.includes(orderItem.name) ||
          orderItem.quantity > quantitiesToCancel[orderItem.name]
      );

      // Update the current order state
      setCurrentOrder(updatedOrder);

      // Clear the selected menu names and quantities after cancellation
      setSelectedMenuNames([]);
      setQuantitiesToCancel({});

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the canceled items.");
        return;
      }

      const canceledItemsContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Cancel KOT</title>
        <style>
          @page { margin: 2mm; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0;  margin-right: 10px; }
          .kot-header { text-align: center; }
          .kot-table { width: 100%; border-collapse: collapse; }
          .kot-table th, .kot-table td { border: 1px dotted black; padding: 3px; text-align: left; }
          .table-name { text-align: center; }
          .datetime-container { display: flex; justify-content: space-between; margin-right: 3px; }
          .label { font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="kot-header">Cancel KOTs</div>
        <div class="table-name">TABLE - ${
          tableInfo ? tableInfo.tableName : "Table Not Found"
        }</div>
        <div class="datetime-container">
          <span class="label">Date: <span id="date"></span></span>
          <span class="label">Time: <span id="time"></span></span>
        </div>
        <div>Waiter: ${waiterName}</div>
        <div>Section Name: ${sectionName}</div>
        <table class="kot-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Items</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            ${selectedMenuNames
              .map((itemName, index) => {
                const quantity = quantitiesToCancel[itemName] || 1; // Get the user-specified quantity
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${itemName}</td>
                    <td>${quantity}</td>
                  </tr>`;
              })
              .join("")}
          </tbody>
        </table>
        <script>
          function updateDateTime() {
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();
            document.getElementById('date').textContent = date;
            document.getElementById('time').textContent = time;
          }
          updateDateTime();
        </script>
      </body>
      </html>`;

      // Write the content to the new window and trigger the print
      printWindow.document.write(canceledItemsContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();

      // router.push('/order')
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling KOT:", error);
    }
  };

  const removeItemFromLocalStorage = (tableId, itemName) => {
    const localStorageKey = `savedBills_${tableId}`;
    const savedBills = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Find the bill with the matching tableId
    const billToUpdate = savedBills.find((bill) => bill.tableId === tableId);

    if (billToUpdate) {
      // Filter out the item with the matching name
      const updatedItems = billToUpdate.items.filter(
        (item) => item.name !== itemName
      );
      const updatedBill = { ...billToUpdate, items: updatedItems };

      // Update localStorage
      const updatedBills = savedBills.map((bill) => {
        if (bill.tableId === tableId) {
          return updatedBill;
        }
        return bill;
      });

      localStorage.setItem(localStorageKey, JSON.stringify(updatedBills));
    }
  };

  // ========taste fuctionality=======//
  useEffect(() => {
    const fetchTastes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/taste/tastes"
        );
        setTastes(response.data);
        // Set the selected option to the first taste in the list (change as needed)
        if (response.data.length > 0) {
          setSelectedOption(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching tastes:", error);
      }
    };

    fetchTastes();
  }, []);

  // taste and other slection valid code
  const handleSelectChange = (orderId, tasteId) => {
    setSelectedTastes((prevSelectedTastes) => ({
      ...prevSelectedTastes,
      [orderId]: tasteId,
    }));
  };

  const handleNewTasteChange = (orderId, newTaste) => {
    setNewTastes((prevNewTastes) => ({
      ...prevNewTastes,
      [orderId]: newTaste,
    }));
  };

  // console.log(modifiedCurrentOrder)
  const modifiedCurrentOrder = currentOrder.map((orderItem) => {
    const selectedTasteId = selectedTastes[orderItem._id];
    const selectedTaste =
      selectedTasteId === "other"
        ? { _id: "other", taste: newTastes[orderItem._id] || "" }
        : tastes.find((taste) => taste.taste === selectedTasteId) || {
            _id: null,
            taste: selectedTasteId,
          }; // Include selectedTasteId as taste if not "other" or not found in tastes

    return {
      ...orderItem,
      selectedTaste,
    };
  });

  const openCloseTablesModal = () => {
    setIsCloseTablesModalOpen(true);
  };

  const handleCloseTablesModal = () => {
    setIsCloseTablesModalOpen(false);
  };

  // waiter fuctionality
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWaiterName(value);
    // ... your existing code for handling other input changes
  };

  const fetchWaitersList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/waiter");
      setWaitersList(response.data);
    } catch (error) {
      console.error(
        "Error fetching waiters list:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchWaitersList();
  }, []);

  const handleConfirmCloseTables = () => {
    // Add logic to perform the closing of tables
    // For example, call an API endpoint or dispatch an action
    setIsCloseTablesModalOpen(false);
    router.push("/bill"); // Redirect to the bill page after confirming
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = lastAllOrders.filter((order) =>
    order.orderNumber.includes(searchQuery)
  );

  const [greetings, setGreetings] = useState([]);
  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/greet/greet"
        );
        setGreetings(response.data);
      } catch (error) {
        console.error("Error fetching greetings:", error);
      }
    };

    fetchGreetings();
  }, []);

  useEffect(() => {
    // Function to fetch the next order number from your backend
    const fetchNextOrderNumber = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/order/get-next-order-number"
        );
        const nextOrderNumber = response.data.nextOrderNumber;
        setOrderNumber(nextOrderNumber);
      } catch (error) {
        console.error("Error fetching next order number:", error);
      }
    };

    // Call the function when the component mounts
    fetchNextOrderNumber();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    fetchLastAllOrders();
  }, []);

  const fetchLastAllOrders = async () => {
    try {
      const ordersResponse = await axios.get(
        "http://localhost:5000/api/order/latest-orders"
      );
      const orders = ordersResponse.data;

      // Fetch table names for each order
      const tableNamesPromises = orders.map(async (order) => {
        const tableResponse = await axios.get(
          `http://localhost:5000/api/table/tables/${order.tableId}`
        );
        const tableName = tableResponse.data?.tableName || "";
        return { ...order, tableName };
      });

      const ordersWithTableNames = await Promise.all(tableNamesPromises);

      // Sort the orders by order date in descending order
      const sortedOrders = ordersWithTableNames.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setLastAllOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching latest orders:", error);
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

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        // Redirect to the dashboard or any desired location
        router.push("/order");
      }
    },
    [router]
  );

  const handleSearchInputKeyDown = (event) => {
    if (event.key === "+") {
      event.preventDefault();
      // Set focus on the first menu item
      if (menuItemRefs.current.length > 0) {
        menuItemRefs.current[0].focus();
      }
    }
  };

  // Search filter
  const filterMenus = (menu) => {
    const searchTerm = searchInput.toLowerCase().trim();

    // If the search term is empty, show all menus
    if (searchTerm === "") {
      return true;
    }

    // Check if the search term is a number
    const searchTermIsNumber = !isNaN(searchTerm);

    // If the search term is a number, filter based on menu's uniqueId
    if (searchTermIsNumber) {
      return menu.uniqueId === searchTerm;
    }

    // Split the search term into words
    const searchLetters = searchTerm.split("");

    // Check if the first letters of both words match the beginning of words in the menu's name
    const firstAlphabetsMatch = searchLetters.every((letter, index) => {
      const words = menu.name.toLowerCase().split(" ");
      const firstAlphabets = words.map((word) => word[0]);
      return firstAlphabets[index] === letter;
    });

    // Check if the full search term is included in the menu's name
    const fullWordIncluded = menu.name.toLowerCase().includes(searchTerm);

    return firstAlphabetsMatch || fullWordIncluded;
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Kot
  const saveBillLan = async () => {
    try {
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              stockQty: foundItem.stockQty,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQty} Bottles`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const itemsWithBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      const orderData = {
        tableId,
        sectionName,
        waiterName,
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId, // Include the selectedParentId in the request body
          };
        }),

        itemsWithBarCategory: itemsWithBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
          selectedParentId: selectedParentId, // Add this line to include selectedParentId
        })),

        itemsWithoutBarCategory: itemsWithoutBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
          selectedParentId: selectedParentId, // Add this line to include selectedParentId
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        VAT: calculateTotal().VAT, // Apply VAT for items with barCategory
        acPercentageAmount,
        acPercentage: acPercentage, // Include AC percentage
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0, // Include VAT percentage
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
      };

      if (
        orderData.itemsWithBarCategory.length === 0 &&
        orderData.itemsWithoutBarCategory.length === 0
      ) {
        alert("No Menu found in KOT / BOT");
        console.warn("No items in the order. Not saving or printing KOT.");
        return;
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        existingItems = existingBill[0].items;
        const updateResponse = await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
      } else {
        const createResponse = await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const newItemsWithBarCategory = orderData.itemsWithBarCategory.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );
      const updatingItemsWithBarCategory = orderData.itemsWithBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithBarCategory = [
        ...newItemsWithBarCategory,
        ...updatingItemsWithBarCategory,
      ];
      const uniqueItemsWithBarCategorySet = new Set(
        uniqueItemsWithBarCategory.map((item) => item.name)
      );

      const newItemsWithoutBarCategory =
        orderData.itemsWithoutBarCategory.filter(
          (newItem) =>
            !existingItems.some(
              (existingItem) => existingItem.name === newItem.name
            )
        );
      const updatingItemsWithoutBarCategory = orderData.itemsWithoutBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithoutBarCategory = [
        ...newItemsWithoutBarCategory,
        ...updatingItemsWithoutBarCategory,
      ];
      const uniqueItemsWithoutBarCategorySet = new Set(
        uniqueItemsWithoutBarCategory.map((item) => item.name)
      );

      const kotData = {
        tableId,
        waiterName,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        itemsWithBarCategory: [...uniqueItemsWithBarCategorySet].map(
          (itemName, index) => {
            const orderItem = uniqueItemsWithBarCategory.find(
              (item) => item.name === itemName
            );
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
                ? orderItem.price
                : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste:
                tasteInfo && tasteInfo.selectedTaste
                  ? tasteInfo.selectedTaste.taste
                  : "",
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        itemsWithoutBarCategory: [...uniqueItemsWithoutBarCategorySet].map(
          (itemName, index) => {
            const orderItem = uniqueItemsWithoutBarCategory.find(
              (item) => item.name === itemName
            );
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
                ? orderItem.price
                : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste:
                tasteInfo && tasteInfo.selectedTaste
                  ? tasteInfo.selectedTaste.taste
                  : "",
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        orderNumber,
      };

      if (
        kotData.itemsWithBarCategory.length === 0 &&
        kotData.itemsWithoutBarCategory.length === 0
      ) {
        console.warn("No items in the KOT. Not saving or printing KOT.");
        return;
      }

      if (
        kotData.itemsWithBarCategory &&
        kotData.itemsWithBarCategory.length > 0
      ) {
        // Make an API call to save the BOT
        const BOTResponse = await axios.post(
          `http://localhost:5000/api/bot/botOrder/${tableId}`,
          kotData
        );

        console.log("BOTResponse:", BOTResponse);

        // Check if the BOT was successfully saved
        if (BOTResponse.status !== 200) {
          console.error("Failed to save BOT.");
          return;
        }
      }
      console.log("kotData:", kotData);

      // Make an API call to save the KOT
      const KOTResponse = await axios.post(
        `http://localhost:5000/api/kot/kotOrder/${tableId}`,
        kotData
      );

      console.log("KOTResponse:", KOTResponse);
      // Check if the KOT was successfully saved
      if (KOTResponse.status !== 200) {
        console.error("Failed to save KOT.");
        return;
      }

      const printBOT = async (items, tableInfo, waiterName) => {
        if (items.length === 0) return; // Prevent printing if no items

        const botContent = generateOrderContentLan(
          items,
          tableInfo,
          waiterName,
          "BOT"
        );

        try {
          // Send BOT content to backend for printing
          const response = await axios.post("http://localhost:5000/print-bot", {
            botContent: botContent, // Pass the generated BOT content
          });

          if (response.status === 200) {
            // alert("BOT printed successfully");
          } else {
            alert("Failed to print BOT");
          }
        } catch (error) {
          console.error("Error printing BOT:", error);
          alert("Failed to print BOT: " + error.message);
        }
      };

      const printKOT = async (items, tableInfo, waiterName) => {
        if (items.length === 0) return; // Prevent printing if no items

        const kotContent = generateOrderContentLan(
          items,
          tableInfo,
          waiterName,
          "KOT"
        );

        try {
          // Send KOT content to backend for printing
          const response = await axios.post("http://localhost:5000/print-kot", {
            kotContent: kotContent, // Pass the generated KOT content
          });

          if (response.status === 200) {
            // alert("KOT printed successfully");
          } else {
            alert("Failed to print KOT");
          }
        } catch (error) {
          console.error("Error printing KOT:", error);
          alert("Failed to print KOT: " + error.message);
        }
      };

      // Function to print both BOT and KOT with a delay

      await printKOT(kotData.itemsWithoutBarCategory, tableInfo, waiterName);
      // Call the printBoth function
      await printBOT(kotData.itemsWithBarCategory, tableInfo, waiterName);

      // const selectedParentIds = JSON.parse(localStorage.getItem('selectedParentIds')) || [];
      // const selectedMenusList = JSON.parse(localStorage.getItem('selectedMenusList')) || [];

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      setCurrentOrder([]);
      // router.push("/order");
      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
    } catch (error) {
      console.error("Error saving bill:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";
      setShowPopup(true);
      setProductName(productName);
    }
  };

  // window.addEventListener("load", () => {
  //   if (localStorage.getItem("redirectAfterReload") === "true") {
  //     localStorage.removeItem("redirectAfterReload"); // Clean up the flag
  //     router.push("/order"); // Redirect to the /order page
  //   }
  // });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLoad = () => {
        if (localStorage.getItem("redirectAfterReload") === "true") {
          localStorage.removeItem("redirectAfterReload");
          router.push("/order");
        }
      };
      window.addEventListener("load", handleLoad);

      // Cleanup event listener on component unmount
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  const generateOrderContentLan = (items, tableInfo, waiterName, orderType) => {
    const lineWidth = 30; // Total width of the line (adjust to match printer's width)
    const columnWidths = {
      name: 32, // Width for item names
      quantity: 1, // Width for quantities
    };

    // Left-align a line of text
    const leftAlignText = (text) => {
      return text.padEnd(lineWidth); // Ensures the text is aligned to the left
    };

    // Slightly offset center text to the left
    const slightlyLeftCenterText = (text, width = lineWidth) => {
      const totalPadding = width - text.length;
      const paddingLeft = Math.floor(totalPadding / 2) - 2; // Slightly reduce left padding
      const paddingRight = totalPadding - paddingLeft;
      return " ".repeat(paddingLeft) + text + " ".repeat(paddingRight);
    };

    // Format date as dd/mm/yyyy
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Format time as hh:mm AM/PM
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const formattedTime = `${String(formattedHours).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;

    // Escape characters for bold (assuming your printer supports it)
    const ESC = "\x1b"; // ESC character
    const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
    const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off

    // ESC/POS commands for font size
    const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
    const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

    // Start building the content
    let content = `${DOUBLE_SIZE_ON}${slightlyLeftCenterText(
      orderType
    )}${NORMAL_SIZE}\n\n`;

    // Add section and table on the same line, left-aligned
    content += `${leftAlignText(
      `Table: ${tableInfo.tableName}             Section: ${tableInfo.section.name}`
    )}\n`;

    // Add date and time on the same line, left-aligned
    content += `${leftAlignText(
      `Date: ${formattedDate}           Time: ${formattedTime}`
    )}\n`;

    // Add the waiter information left-aligned
    content += `${leftAlignText(
      `Waiter: ${waiterName}                                 `
    )}\n`;

    // Create table header
    const tableWidth = columnWidths.name + columnWidths.quantity + 7; // Width for table borders
    const borderLine = "-".repeat(tableWidth);

    // Table header with borders and bold text
    const headerText = `${BOLD_ON}${"Item".padEnd(
      columnWidths.name
    )}${BOLD_OFF}  ${BOLD_ON}${"Qty".padEnd(columnWidths.quantity)}${BOLD_OFF}`;

    // Add the table header and borders left-aligned
    content += `${borderLine}\n`;
    content += `${headerText}\n`;
    content += `${borderLine}\n`;

    // Process each item and align the content, adding taste if available
    items.forEach((item) => {
      // Combine the item name with taste, if provided
      let itemNameWithTaste = item.name;
      if (item.taste) {
        itemNameWithTaste += ` (${item.taste})`; // Add taste in parentheses
      }

      // Item row with vertical bars
      let itemText = `${BOLD_ON}${itemNameWithTaste.padEnd(
        columnWidths.name
      )}${BOLD_OFF}  ${item.quantity
        .toString()
        .padStart(columnWidths.quantity)}`;
      content += `${leftAlignText(itemText)}\n`;
    });

    // Add the closing border line
    content += `${borderLine}\n`;

    return content;
  };

  // Kot
  const saveBill = async () => {
    try {
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              stockQty: foundItem.stockQty,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQty} Bottles`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const itemsWithBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = modifiedCurrentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      const orderData = {
        tableId,
        sectionName: tableInfo.section.name,
        waiterName,
        // items: modifiedCurrentOrder.map((orderItem) => ({
        //   name: orderItem.name,
        //   quantity: orderItem.quantity,
        //   price: orderItem.price
        //     ? orderItem.price
        //     : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
        //   taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
        //   barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        //   selectedParentId: selectedParentId // Add this line to include selectedParentId
        // })),
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId, // Include the selectedParentId in the request body
          };
        }),

        itemsWithBarCategory: itemsWithBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
          selectedParentId: selectedParentId, // Add this line to include selectedParentId
        })),

        itemsWithoutBarCategory: itemsWithoutBarCategory.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
          selectedParentId: selectedParentId, // Add this line to include selectedParentId
        })),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        VAT: calculateTotal().VAT, // Apply VAT for items with barCategory
        acPercentageAmount,
        acPercentage: acPercentage, // Include AC percentage
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0, // Include VAT percentage
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
      };

      if (
        orderData.itemsWithBarCategory.length === 0 &&
        orderData.itemsWithoutBarCategory.length === 0
      ) {
        alert("No Menu found in KOT / BOT");
        console.warn("No items in the order. Not saving or printing KOT.");
        return;
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        existingItems = existingBill[0].items;
        const updateResponse = await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
      } else {
        const createResponse = await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const newItemsWithBarCategory = orderData.itemsWithBarCategory.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );
      const updatingItemsWithBarCategory = orderData.itemsWithBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithBarCategory = [
        ...newItemsWithBarCategory,
        ...updatingItemsWithBarCategory,
      ];
      const uniqueItemsWithBarCategorySet = new Set(
        uniqueItemsWithBarCategory.map((item) => item.name)
      );

      const newItemsWithoutBarCategory =
        orderData.itemsWithoutBarCategory.filter(
          (newItem) =>
            !existingItems.some(
              (existingItem) => existingItem.name === newItem.name
            )
        );
      const updatingItemsWithoutBarCategory = orderData.itemsWithoutBarCategory
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0);

      const uniqueItemsWithoutBarCategory = [
        ...newItemsWithoutBarCategory,
        ...updatingItemsWithoutBarCategory,
      ];
      const uniqueItemsWithoutBarCategorySet = new Set(
        uniqueItemsWithoutBarCategory.map((item) => item.name)
      );

      const kotData = {
        tableId,
        waiterName,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        itemsWithBarCategory: [...uniqueItemsWithBarCategorySet].map(
          (itemName, index) => {
            const orderItem = uniqueItemsWithBarCategory.find(
              (item) => item.name === itemName
            );
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
                ? orderItem.price
                : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste:
                tasteInfo && tasteInfo.selectedTaste
                  ? tasteInfo.selectedTaste.taste
                  : "",
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        itemsWithoutBarCategory: [...uniqueItemsWithoutBarCategorySet].map(
          (itemName, index) => {
            const orderItem = uniqueItemsWithoutBarCategory.find(
              (item) => item.name === itemName
            );
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return {
              name: orderItem.name,
              quantity: orderItem.quantity,
              price: orderItem.price
                ? orderItem.price
                : orderItem.pricePer?.[`pricePer${orderItem.barCategory}`],
              taste:
                tasteInfo && tasteInfo.selectedTaste
                  ? tasteInfo.selectedTaste.taste
                  : "",
              barCategory: orderItem.barCategory ? orderItem.barCategory : null,
            };
          }
        ),
        orderNumber,
      };

      if (
        kotData.itemsWithBarCategory.length === 0 &&
        kotData.itemsWithoutBarCategory.length === 0
      ) {
        console.warn("No items in the KOT. Not saving or printing KOT.");
        return;
      }

      if (
        kotData.itemsWithBarCategory &&
        kotData.itemsWithBarCategory.length > 0
      ) {
        // Make an API call to save the BOT
        const BOTResponse = await axios.post(
          `http://localhost:5000/api/bot/botOrder/${tableId}`,
          kotData
        );

        console.log("BOTResponse:", BOTResponse);

        // Check if the BOT was successfully saved
        if (BOTResponse.status !== 200) {
          console.error("Failed to save BOT.");
          return;
        }
      }
      console.log("kotData:", kotData);

      // Make an API call to save the KOT
      const KOTResponse = await axios.post(
        `http://localhost:5000/api/kot/kotOrder/${tableId}`,
        kotData
      );

      console.log("KOTResponse:", KOTResponse);
      // Check if the KOT was successfully saved
      if (KOTResponse.status !== 200) {
        console.error("Failed to save KOT.");
        return;
      }

      const printBOT = (items, tableInfo, waiterName) => {
        if (items.length === 0) return; // Prevent opening preview if no items

        const printWindow = window.open("", "_self");

        if (!printWindow) {
          alert("Please allow pop-ups to print the BOT.");
          return;
        }

        const botContent = generateOrderContent(
          items,
          tableInfo,
          waiterName,
          "BOT"
        );
        printWindow.document.write(botContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();

        window.location.reload();
      };

      printBOT(kotData.itemsWithBarCategory, tableInfo, waiterName);

      const printKOT = (items, tableInfo, waiterName) => {
        if (items.length === 0) return; // Prevent opening preview if no items

        const printWindow = window.open("", "_self");

        if (!printWindow) {
          alert("Please allow pop-ups to print the KOT.");
          return;
        }

        const kotContent = generateOrderContent(
          items,
          tableInfo,
          waiterName,
          "KOT"
        );
        printWindow.document.write(kotContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      };

      printKOT(kotData.itemsWithoutBarCategory, tableInfo, waiterName);

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      setCurrentOrder([]);
      // router.push("/order");
      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
    } catch (error) {
      console.error("Error saving bill:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";
      setShowPopup(true);
      setProductName(productName);
    }
  };

  // window.addEventListener("load", () => {
  //   if (localStorage.getItem("redirectAfterReload") === "true") {
  //     localStorage.removeItem("redirectAfterReload"); // Clean up the flag
  //     router.push("/order"); // Redirect to the /order page
  //   }
  // });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLoad = () => {
        if (localStorage.getItem("redirectAfterReload") === "true") {
          localStorage.removeItem("redirectAfterReload"); // Clean up the flag
          router.push("/order"); // Redirect to the /order page
        }
      };

      // Add the load event listener
      window.addEventListener("load", handleLoad);

      // Cleanup event listener on component unmount
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [router]);

  // if (typeof window !== 'undefined') {
  //   window.addEventListener("load", () => {
  //     if (localStorage.getItem("redirectAfterReload") === "true") {
  //       localStorage.removeItem("redirectAfterReload");  // Clean up the flag
  //       router.push("/order");  // Redirect to the /order page
  //     }
  //   });
  // }

  const generateOrderContent = (items, tableInfo, waiterName, orderType) => {
    const orderHeading = orderType === "BOT" ? "BOT" : "KOT";

    if (items.length === 0) {
      console.warn(
        `No items in the ${orderHeading}. Not generating empty preview.`
      );
      return ""; // Return empty string if no items
    }

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${orderHeading} - Bar Order Ticket</title>
        <style>
          /* Add your custom styles for BOT/KOT print here */
          .counter-content {
            page-break-after: always;
        }
          @page {
            margin: 2mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            margin-top: -2px;
            margin-right: 10px;
          }
          .kot-header {
            text-align: center;
          }
          .kot-table {
            width: 100%;
            border-collapse: collapse;
          }
          .kot-table th, .kot-table td {
            border-top: 1px dotted black;
            border-bottom: 1px dotted black;
            border-left: 1px dotted black;
            border-right: 1px dotted black;
            text-align: left;
            padding: 3px;
          }
          .table-name {
            text-align: center;
            margin-bottom:1rem
          }
          .sections {
            display: flex;
          }
          .space {
            margin: 0 50px;
          }
          .datetime-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 10px;

          }
          .datetime-container p {
            font-size: 10px;
          }
          .label {
            margin-top: -1rem;
            font-size: 12px;
          }
          .table-name {
            margin: 0 0px;
            margin-bottom:1rem

          }
        </style>
      </head>
      <body>
      <div class="counter-content">
      <div class="kot-header">
        ${orderHeading}
      </div>
     <div style="display: flex; align-items: center; margin-bottom: 1rem; text-align: center; font-size: 16px;">
  <span style="margin-right: 25px;">
    Table - ${tableInfo ? tableInfo.tableName : "Table Not Found"}
  </span>
  <span>
    Section - ${tableInfo ? tableInfo.section.name : "Table Not Found"}
  </span>
</div>
      <div class="datetime-container">
        <span class="label">Date:<span id="date" class="datetime"></span></span>
        <span class="datetime-space"> </span>
        <span class="label">Time:<span id="time" class="datetime"></span></span>
      </div>
      <div>
        <span>Waiter: ${waiterName}</span>
      </div>
      <div class="kot-date-time" id="date-time"></div>
      <div class="kot-items">
        <table class="kot-table">
          <thead>
            <tr>
              <th> Sr</th>
              <th>Items</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="kot-item-name">${item.name}${
                  item.taste ? `<br>Taste - ${item.taste}` : ""
                }</td>
                <td>${item.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
   
        <script>
          function updateKOTDate() {
            const dateElement = document.getElementById('date');
            const now = new Date();
            if (now.getHours() < 3) {
              now.setDate(now.getDate() - 1);
            }
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const formattedDate = day + '/' + month + '/' + year;
            dateElement.textContent = formattedDate;
            return formattedDate;
          }
          function updateActualTime() {
            const timeElement = document.getElementById('time');
            const now = new Date();
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formattedTime = now.toLocaleTimeString('en-US', options);
            timeElement.textContent = formattedTime;
          }
          function updateDateTime() {
            const kotDate = updateKOTDate();
            updateActualTime();
            setTimeout(updateDateTime, 1000);
          }
          updateDateTime();
        </script>
      </body>
    </html>
  `;
  };

  // Re-Kot
  const saveKotLan = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingKOTResponse = await axios.get(
        `http://localhost:5000/api/kot/kot/${tableId}`
      );
      const existingKOT = existingKOTResponse.data;
      console.log(existingKOT);

      if (!existingKOT) {
        alert("No menu items added to the order.");
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingKOT.itemsWithoutBarCategory || [];
      if (existingItems.length === 0) {
        alert("No any previous KOT found");
        console.log("No Items in KOT");
        return;
      }

      //   const generateOrderContent = (
      //     items,
      //     tableInfo,
      //     waiterName,
      //     orderType
      //   ) => {
      //     const lineWidth = 20; // Width of each line for alignment
      //     const columnWidths = {
      //       name: 30, // Width for item names
      //       quantity: 1, // Width for quantities
      //     };

      //     // Left-align a line of text
      //     const leftAlignText = (text) => {
      //       return text.padEnd(lineWidth);
      //     };

      //     // Center a line of text by adding spaces before it
      //     const centerText = (text) => {
      //       const padding = Math.floor((lineWidth - text.length) / 2);
      //       return " ".repeat(padding > 0 ? padding : 0) + text;
      //     };

      //     // Format date as dd/mm/yyyy
      //     const now = new Date();
      //     const day = String(now.getDate()).padStart(2, "0");
      //     const month = String(now.getMonth() + 1).padStart(2, "0");
      //     const year = now.getFullYear();
      //     const formattedDate = `${day}/${month}/${year}`;

      //     // Format time as hh:mm AM/PM
      //     const hours = now.getHours();
      //     const minutes = String(now.getMinutes()).padStart(2, "0");
      //     const period = hours >= 12 ? "PM" : "AM";
      //     const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
      //     const formattedTime = `${String(formattedHours).padStart(
      //       2,
      //       "0"
      //     )}:${minutes} ${period}`;

      //   // Escape characters for bold (assuming your printer supports it)
      //   const ESC = "\x1b"; // ESC character
      //   const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
      //   const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off

      //   // ESC/POS commands for font size
      //   const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
      //   const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

      //     // Start building the content
      //     // Start building the content
      // let content = `${DOUBLE_SIZE_ON}${(orderType)}${NORMAL_SIZE}\n\n`;

      //     // Add section and table on the same line, left-aligned
      //     content += `${leftAlignText(
      //       `Table: ${tableInfo.tableName}             Section: ${tableInfo.section.name}`
      //     )}\n`;

      //     // Add date and time on the same line, left-aligned
      //     content += `${leftAlignText(
      //       `Date: ${formattedDate}           Time: ${formattedTime}`
      //     )}\n`;

      //     // Add the waiter information left-aligned
      //     content += `${leftAlignText(`Waiter: ${waiterName}                      `)}\n\n`;

      //     // Create table header and border lines
      //     const tableWidth = columnWidths.name + columnWidths.quantity + 7; // Width for table borders
      //     const borderLine = "-".repeat(tableWidth);
      //     const headerText = `${BOLD_ON}${BOLD_ON}${"Item".padEnd(
      //       columnWidths.name
      //     )} Qty ${" ".repeat(columnWidths.quantity)}${BOLD_OFF}${BOLD_OFF}`;

      //     // Add the table header and borders left-aligned
      //     content += `${leftAlignText(borderLine)}\n`;
      //     content += `${leftAlignText(headerText)}\n`;
      //     content += `${leftAlignText(borderLine)}\n`;

      //     // Process each item and align the content, adding taste if available
      //     items.forEach((item) => {
      //       let itemText = `${item.name.padEnd(
      //         columnWidths.name
      //       )}  ${item.quantity.toString().padStart(columnWidths.quantity)}`;
      //       content += `${BOLD_ON}${BOLD_ON}${leftAlignText(itemText)}${BOLD_OFF}${BOLD_OFF}\n`;

      //       // Check if taste is provided and add it on the next line if the name is too long
      //       if (item.taste) {
      //         const tasteText = `(${item.taste})`;
      //         if (item.name.length > columnWidths.name) {
      //           // If item name is too long, add taste on the next line
      //           content += `${leftAlignText(
      //             ` ${tasteText.padEnd(columnWidths.name)}      `
      //           )}\n`;
      //         } else {
      //           // If item name fits, append taste to the same line
      //           itemText = ` ${(item.name + " (" + item.taste + ")").padEnd(
      //             columnWidths.name
      //           )}  ${item.quantity
      //             .toString()
      //             .padStart(columnWidths.quantity)} `;
      //           content += `${leftAlignText(itemText)}\n`;
      //         }
      //       }
      //     });

      //     // Add the closing border line
      //     content += `${leftAlignText(borderLine)}\n`;

      //     return content;
      //   };

      const generateOrderContentLan = (
        items,
        tableInfo,
        waiterName,
        orderType
      ) => {
        const lineWidth = 40; // Increase line width to accommodate longer text
        const columnWidths = {
          name: 30, // Width for item names
          quantity: 5, // Width for quantities
        };

        // Left-align a line of text
        const leftAlignText = (text) => {
          return text.padEnd(lineWidth);
        };

        // Format date as dd/mm/yyyy
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Format time as hh:mm AM/PM
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        const formattedTime = `${String(formattedHours).padStart(
          2,
          "0"
        )}:${minutes} ${period}`;

        // Escape characters for bold (assuming your printer supports it)
        const ESC = "\x1b"; // ESC character
        const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
        const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off

        // ESC/POS commands for font size
        const DOUBLE_SIZE_ON = `\x1d\x21\x11`; // Double size (both width and height)
        const NORMAL_SIZE = `\x1d\x21\x00`; // Normal size

        // Start building the content
        let content = `${DOUBLE_SIZE_ON}${orderType}${NORMAL_SIZE}\n\n`;

        // Add section and table on the same line, left-aligned
        content += `${leftAlignText(
          `Table: ${tableInfo.tableName}          Section: ${tableInfo.section.name}`
        )}\n`;

        // Add date and time on the same line, left-aligned
        content += `${leftAlignText(
          `Date: ${formattedDate}     Time: ${formattedTime}`
        )}\n`;

        // Add the waiter information left-aligned
        content += `${leftAlignText(`Waiter: ${waiterName}`)}\n`;

        // Create table header and border lines
        const borderLine = "-".repeat(lineWidth);
        const headerText = `${"Item".padEnd(columnWidths.name)}Qty`.padEnd(
          columnWidths.quantity
        );

        // Add the table header and borders left-aligned
        content += `${borderLine}\n`;
        content += `${headerText}\n`;
        content += `${borderLine}\n`;

        // Process each item and align the content, adding taste if available
        items.forEach((item) => {
          let itemText = `${item.name.padEnd(columnWidths.name)}${item.quantity
            .toString()
            .padStart(columnWidths.quantity)}`;
          content += `${BOLD_ON}${leftAlignText(itemText)}${BOLD_OFF}\n`;

          // Check if taste is provided and add it
          if (item.taste) {
            const tasteText = `(${item.taste})`;
            content += `${leftAlignText(
              ` ${tasteText.padEnd(columnWidths.name)}`
            )}\n`;
          }
        });

        // Add the closing border line
        content += `${borderLine}\n`;

        return content;
      };

      // Example usage
      const orderContent = generateOrderContentLan(
        existingItems,
        tableInfo,
        existingKOT.waiterName,
        "Re-KOT"
      );
      // Send KOT content to the backend for printing
      await axios.post("http://localhost:5000/print-kot", {
        kotContent: orderContent,
      });

      // Write the content to the new window or iframe
      printWindow.document.write(kotContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/order");
    } catch (error) {
      console.error("Error saving KOT:", error);
    }
  };

  // Re-Bot
  const saveBotLan = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBOTResponse = await axios.get(
        `http://localhost:5000/api/bot/bot/${tableId}`
      );
      const existingBOT = existingBOTResponse.data;
      console.log(existingBOT);

      if (!existingBOT) {
        alert("No menu items added to the order.");
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingBOT.itemsWithBarCategory || [];
      if (existingItems.length === 0) {
        console.log("No Items in BOT");
        return;
      }
      //   const generateBOTContent = (items, tableInfo, waiterName, orderType) => {
      //     const lineWidth = 20; // Width of each line for centering
      //     const columnWidths = {
      //       name: 30, // Width for item names
      //       quantity: 2, // Width for quantities
      //     };

      //     // Center a line of text by adding spaces before it
      //     const centerText = (text) => {
      //       const padding = Math.floor((lineWidth - text.length) / 2);
      //       return " ".repeat(padding > 0 ? padding : 0) + text;
      //     };

      //     // Left-align a line of text
      //     const leftAlignText = (text) => {
      //       return text.padEnd(lineWidth);
      //     };

      //     // Center a block of text (like a table header) with borders
      //     const centerBlock = (block) => {
      //       const blockWidth = lineWidth; // Block width should match the lineWidth for centering
      //       return block
      //         .split("\n")
      //         .map((line) => centerText(line))
      //         .join("\n");
      //     };

      //     // Format date as dd/mm/yyyy
      //     const now = new Date();
      //     const day = String(now.getDate()).padStart(2, "0");
      //     const month = String(now.getMonth() + 1).padStart(2, "0");
      //     const year = now.getFullYear();
      //     const formattedDate = `${day}/${month}/${year}`;

      //     // Format time as hh:mm AM/PM
      //     const hours = now.getHours();
      //     const minutes = String(now.getMinutes()).padStart(2, "0");
      //     const period = hours >= 12 ? "PM" : "AM";
      //     const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
      //     const formattedTime = `${String(formattedHours).padStart(
      //       2,
      //       "0"
      //     )}:${minutes} ${period}`;

      //      // Escape characters for bold (assuming your printer supports it)
      //   const ESC = "\x1b"; // ESC character
      //   const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
      //   const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off

      //   // ESC/POS commands for font size
      //   const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
      //   const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

      //     // Start building the content
      //     // Start building the content
      // let content = `${DOUBLE_SIZE_ON}${(orderType)}${NORMAL_SIZE}\n\n`;

      //     // Add section and table on the same line, left-aligned
      //     content += `${leftAlignText(
      //       `Table: ${tableInfo.tableName}            Section: ${tableInfo.section.name}`
      //     )}\n`;

      //     // Add date and time on the same line, left-aligned
      //     content += `${leftAlignText(
      //       `Date: ${formattedDate}       Time: ${formattedTime}`
      //     )}\n`;

      //     // Add the waiter information left-aligned
      //     content += `${leftAlignText(`Waiter: ${waiterName}         `)}\n\n`;

      //     // Create table header
      //     const tableWidth = columnWidths.name + columnWidths.quantity + 7; // Width for table borders
      //     const borderLine = "-".repeat(tableWidth);
      //     const headerText = `${BOLD_ON}${BOLD_ON}${"Item".padEnd(
      //       columnWidths.name
      //     )} Qty ${" ".repeat(columnWidths.quantity )}${BOLD_OFF}${BOLD_OFF}`;

      //     // Combine the table header and borders into a block
      //     const tableBlock = [borderLine, headerText, borderLine].join("\n");

      //     // Center the table block
      //     content += `${(tableBlock)}\n`;

      //     // Process each item and align the content
      //     items.forEach((item) => {
      //       const itemText = `${item.name.padEnd(
      //         columnWidths.name
      //       )}${item.quantity.toString().padStart(columnWidths.quantity)}`;
      //       content += `${BOLD_ON}${BOLD_ON}${leftAlignText(itemText)}${BOLD_OFF}${BOLD_OFF}\n`;
      //     });

      //     // Add the closing border line
      //     content += `${borderLine}\n`;

      //     return content;
      //   };

      const generateBOTContentLan = (
        items,
        tableInfo,
        waiterName,
        orderType
      ) => {
        const lineWidth = 40; // Adjust this value based on your printer's width
        const columnWidths = {
          name: 30, // Width for item names
          quantity: 5, // Width for quantities
        };

        // Left-align a line of text
        const leftAlignText = (text) => {
          return text.padEnd(lineWidth); // Ensures text is aligned to the left
        };

        // Format date as dd/mm/yyyy
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Format time as hh:mm AM/PM
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        const formattedTime = `${String(formattedHours).padStart(
          2,
          "0"
        )}:${minutes} ${period}`;

        // Escape characters for bold (assuming your printer supports it)
        const ESC = "\x1b"; // ESC character
        const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
        const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off

        // ESC/POS commands for font size
        const DOUBLE_SIZE_ON = `\x1d\x21\x11`; // Double size (both width and height)
        const NORMAL_SIZE = `\x1d\x21\x00`; // Normal size

        // Start building the content
        let content = `${DOUBLE_SIZE_ON}${orderType}${NORMAL_SIZE}\n\n`;

        // Left-align Table and Section line
        content += `${leftAlignText(
          `Table: ${tableInfo.tableName}            Section: ${tableInfo.section.name}`
        )}\n`;

        // Left-align Date and Time line
        content += `${leftAlignText(
          `Date: ${formattedDate}    Time: ${formattedTime}`
        )}\n`;

        // Left-align Waiter information
        content += `${leftAlignText(`Waiter: ${waiterName}`)}\n\n`;

        // Create table header
        const borderLine = "-".repeat(lineWidth);
        const headerText = `${BOLD_ON}${"Item".padEnd(
          columnWidths.name
        )} Qty${BOLD_OFF}`;

        // Add the table header with borders
        content += `${borderLine}\n${headerText}\n${borderLine}\n`;

        // Process each item and align content from the left
        items.forEach((item) => {
          const itemText = `${item.name.padEnd(
            columnWidths.name
          )} ${item.quantity.toString().padStart(columnWidths.quantity)}`;
          content += `${BOLD_ON}${leftAlignText(itemText)}${BOLD_OFF}\n`;
        });

        // Add closing border line
        content += `${borderLine}\n`;

        return content;
      };

      // Generate BOT content
      const botContent = generateBOTContentLan(
        existingItems,
        tableInfo,
        existingBOT.waiterName,
        "Re-BOT"
      );

      // Send the botContent to the backend for printing
      const response = await axios.post("http://localhost:5000/print-bot", {
        botContent,
      });
      if (response.status === 200) {
        console.log("BOT printed successfully");
      } else {
        console.error("Error printing BOT:", response.data);
      }
      router.push("/order");
    } catch (error) {
      console.error("Error saving BOT:", error);
    }
  };

  // Re-Kot
  const saveKot = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingKOTResponse = await axios.get(
        `http://localhost:5000/api/kot/kot/${tableId}`
      );
      const existingKOT = existingKOTResponse.data;
      console.log(existingKOT);

      if (!existingKOT) {
        alert("No menu items added to the order.");
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingKOT.itemsWithoutBarCategory || [];
      if (existingItems.length === 0) {
        alert("No any previous KOT found");
        console.log("No Items in KOT");
        return;
      }
      const printWindow = window.open("", "_blank");
      // console.log(existingItems);
      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      const kotContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Re-Kitchen Order Ticket (RE-KOT)</title>
            <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
              margin-right: 10px;
         
            }
            .kot-header {
              text-align: center;
            }
         
            .kot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-table th, .kot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
            font-size: 13px

            }
             .datetime-container p{
            font-size: 13px
            }
            .label{
              margin-top:-1rem
              font-size:12px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
          </head>
          <body>
            <div class="kot-header">
              Re-KOT
            </div>
             <div style="display: flex; align-items: center; text-align: center; font-size: 16px;">
  <span style="margin-right: 25px;">
    Table - ${tableInfo ? tableInfo.tableName : "Table Not Found"}
  </span>
  <span>
    Section - ${tableInfo ? tableInfo.section.name : "Table Not Found"}
  </span>
</div>
            <div class="datetime-container">
              <span class="label">Date:<span id="date" class="datetime"></span></span>
              <span class="datetime-space"></span>
              <span class="label">Time:<span id="time" class="datetime"></span></span>
            </div>
            <div>
           <span>Waiter: ${existingKOT.waiterName}</span>
          </div>
            <div class="kot-items">
              <table class="kot-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Items</th>
                    <th>Qty</th>
                  </tr>
                </thead>

                <tbody>
            ${existingItems
              .map(
                (orderItem, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="kot-item-name">${orderItem.name}${
                  orderItem.taste ? `<br>Taste - ${orderItem.taste}` : ""
                }</td>
                  <td>${orderItem.quantity}</td>
                </tr>
              `
              )
              .join("")}
</tbody>
               
              </table>
            </div>
            <script>
              function updateDateTime() {
                const dateElement = document.getElementById('date');
                const timeElement = document.getElementById('time');
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const formattedDate = day + '/' + month + '/' + year;
                const options = { hour: 'numeric', minute: 'numeric' };
                const formattedTime = now.toLocaleTimeString('en-US', options);
                dateElement.textContent = formattedDate;
                timeElement.textContent = formattedTime;
              }
              updateDateTime();
              setInterval(updateDateTime, 1000);
            </script>


           
          </body>
        </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(kotContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/order");
    } catch (error) {
      console.error("Error saving KOT:", error);
    }
  };

  // Re-Bot
  const saveBot = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBOTResponse = await axios.get(
        `http://localhost:5000/api/bot/bot/${tableId}`
      );
      const existingBOT = existingBOTResponse.data;
      console.log(existingBOT);

      if (!existingBOT) {
        alert("No menu items added to the order.");
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingBOT.itemsWithBarCategory || [];
      if (existingItems.length === 0) {
        console.log("No Items in BOT");
        return;
      }
      const printWindow = window.open("", "_blank");
      // console.log(existingItems);
      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      const botContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Re-Bar Order Ticket (RE-KOT)</title>
            <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
              margin-right:10px;
         
            }
            .bot-header {
              text-align: center;
            }
         
            .bot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .bot-table th, .bot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
             font-size: 13px

            }
             .datetime-container p{
            font-size:10px
            }
            .label{
              margin-top:-1rem
              font-size:12px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
          </head>
          <body>
            <div class="bot-header">
              Re-BOT
            </div>
            <div class="sections">
              <span class="table-name">
                TABLE- ${tableInfo ? tableInfo.tableName : "Table Not Found"}
              </span>
              <span class="space"></span>
            </div>
            <div class="datetime-container">
              <span class="label">Date:<span id="date" class="datetime"></span></span>
              <span class="datetime-space"></span>
              <span class="label">Time:<span id="time" class="datetime"></span></span>
            </div>
            <div>
           <span>Waiter: ${existingBOT.waiterName}</span>
          </div>
            <div class="bot-items">
              <table class="bot-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Items</th>
                    <th>Qty</th>
                  </tr>
                </thead>

                <tbody>
            ${existingItems
              .map(
                (orderItem, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="bot-item-name">${orderItem.name}${
                  orderItem.taste ? `<br>Taste - ${orderItem.taste}` : ""
                }</td>
                  <td>${orderItem.quantity}</td>
                </tr>
              `
              )
              .join("")}
</tbody>
               
              </table>
            </div>
            <script>
              function updateDateTime() {
                const dateElement = document.getElementById('date');
                const timeElement = document.getElementById('time');
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const formattedDate = day + '/' + month + '/' + year;
                const options = { hour: 'numeric', minute: 'numeric' };
                const formattedTime = now.toLocaleTimeString('en-US', options);
                dateElement.textContent = formattedDate;
                timeElement.textContent = formattedTime;
              }
              updateDateTime();
              setInterval(updateDateTime, 1000);
            </script>


           
          </body>
        </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(botContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/order");
    } catch (error) {
      console.error("Error saving BOT:", error);
    }
  };

  const WaitingBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          console.log(foundItem);
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock : ${stockDetails.stockQtyMl} ml`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }
      // Prepare order data
      const orderData = {
        tableId,
        waiterName,
        sectionName: tableInfo.section.name,
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: isACEnabled
          ? calculateTotal().acPercentageAmount
          : 0,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        existingItems = existingBill[0].items;
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Save the bill in localStorage (same as your original code)
      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");
      localStorage.removeItem("selectedMenusList");

      setCurrentOrder([]);
      router.push("/order");
    } catch (error) {
      console.error("Error saving bill:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      setShowPopup(true);
      setProductName(productName);
    }
  };

  // print Bill
  const handlePrintBillLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return;
          }
        }
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );
      console.log("Temporary Order Index:", temporaryOrderIndex);

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      const orderData = {
        tableId: existingBill.tableId,
        sectionName,
        waiterName,
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;

          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        isTemporary: true,
        isPrint: 1,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        console.log("Creating New Order");
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Update selectedMenusList with itemsWithBarCategory
      itemsWithBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity:
              orderItem.quantity *
              parseInt(orderItem.barCategory.replace("ml", "")),
          });
        }
      });

      // Add itemsWithoutBarCategory to selectedMenusList
      itemsWithoutBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity: orderItem.quantity,
          });
        }
      });

      // Function to format the date in dd/mm/yyyy format
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Function to format the time in hh:mm:ss AM/PM format
      const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      };

      // Get the current date and time
      const currentDate = new Date();
      const {
        subtotal,
        CGST,
        SGST,
        total,
        grandTotal,
        totalQuantity,
        acPercentageAmount,
      } = calculateTotal();
      const maxItemNameLength = 20; // Max length for each line in Items column
      const ESC = "\x1b"; // ESC character
      const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
      const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off
      const CENTER_ALIGN = `${ESC}a1`; // ESC a1 centers the text
      const LEFT_ALIGN = `${ESC}a0`; // ESC a0 aligns text to the left
      // ESC/POS commands for font size
      const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
      const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

      const PAGE_WIDTH = 40; // Total width of the line

      // Function to pad spaces between label and value
      const padLabelValue = (label, value) => {
        const totalLength = label.length + value.length;
        const spacesNeeded = PAGE_WIDTH - totalLength;
        return `${label}${" ".repeat(spacesNeeded)}${value}`;
      };

      // Safeguard to ensure values are valid numbers
      const formatValue = (value) => {
        return isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);
      };
      const roundedTotal = Math.round(grandTotal); // Round up the grand total
      const formattedTotal = formatValue(roundedTotal); // Format the rounded total

      // Helper function to format a line if value is present
      const formatLine = (label, value) =>
        value > 0 ? padLabelValue(label, formatValue(value)) : "";

      const billContent = `
      ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${
        hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"
      }${NORMAL_SIZE}
      ${
        hotelInfo && hotelInfo.hotelLogo
          ? `<img class="logo" src="http://localhost:5000/${hotelInfo.hotelLogo}" alt="Hotel Logo" style="max-height: 100px; max-width: 100px;" />`
          : ""
      }
${CENTER_ALIGN}${BOLD_ON}${hotelInfo ? hotelInfo.address : "Address Not Found"}
${CENTER_ALIGN}${BOLD_ON}${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}
${hotelInfo && hotelInfo.gstNo ? `GSTIN: ${hotelInfo.gstNo}` : ""}
${hotelInfo && hotelInfo.sacNo ? `SAC No: ${hotelInfo.sacNo}` : ""}
${hotelInfo && hotelInfo.fssaiNo ? `FSSAI No: ${hotelInfo.fssaiNo}` : ""} 
  ${LEFT_ALIGN}${BOLD_ON}Bill No: ${
        existingBill.length > 0
          ? existingBill[0].orderNumber
            ? existingBill[0].orderNumber
            : orderNo
          : orderNo
      }            Table No: ${BOLD_ON}${
        tableInfo ? tableInfo.tableName : "Table Not Found"
      }             
  Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}
  ${LEFT_ALIGN}Waiter: ${
        waiterName || "         "
      }     Section: ${BOLD_ON}${sectionName}     -----------------------------------------
  SR    Items           Qty       Price
 -----------------------------------------
 ${BOLD_ON}${currentOrder
        .map((orderItem, index) => {
          const itemPrice =
            orderItem.price ||
            orderItem.pricePer?.[`pricePer${orderItem.barCategory}`];
          const formattedPrice = (itemPrice * orderItem.quantity)
            .toFixed(2)
            .padStart(8);
          let itemName = orderItem.name;
          if (itemName.length > maxItemNameLength) {
            itemName = itemName.slice(0, maxItemNameLength - 3) + "...";
          }
          // Format the first line with SR, first part of the item name, Qty, and Price
          let output = `${String(index + 1)
            .padStart(2) // SR number padded to 2 characters for alignment
            .padEnd(3)} ${itemName.padEnd(20)} ${String(
            orderItem.quantity
          ).padEnd(3)} ${formattedPrice.padStart(1)}\n`;
          return output;
        })
        .join("")} -----------------------------------------
  ${LEFT_ALIGN}Total Items: ${totalQuantity}
  -----------------------------------------
  ${padLabelValue("Subtotal:", formatValue(subtotal))}
  ${formatLine("CGST:", CGST)}
  ${formatLine("SGST:", SGST)}
  ${formatLine("AC:", acPercentageAmount)}
  ${total > 0 ? `${padLabelValue("Bar Total:", formatValue(total))}` : ""}
  -------------------------------------------
  ${LEFT_ALIGN}${padLabelValue(
        "Grand Total:",
        `${DOUBLE_SIZE_ON}${formattedTotal}${NORMAL_SIZE}`
      )}
  ${CENTER_ALIGN}${greetings
        .map((index) => {
          return `
${index.greet}
${index.message}`;
        })
        .join("")}---------------------------------------------
    AB Software Solution: 8888732973
    `;

      // You can now pass `billContent` to your print function or display it.
      // Post the formatted bill content to the print API
      console.log(billContent);
      const response = await axios.post("http://localhost:5000/print-bill", {
        billContent,
      });

      if (response.status === 200) {
        alert("Bill printed successfully");
      } else {
        alert("Failed to print the bill");
      }

      // Clear local storage and other operations...
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  useEffect(() => {
    // Ensure the code only runs on the client side
    if (typeof window !== "undefined") {
      const handleLoad = () => {
        if (localStorage.getItem("redirectAfterReload") === "true") {
          localStorage.removeItem("redirectAfterReload"); // Clean up the flag
          router.push("/order"); // Redirect to the /order page
        }
      };

      // Add event listener for 'load' event
      window.addEventListener("load", handleLoad);

      // Clean up the event listener on component unmount
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [router]);

  // print Bill
  const handlePrintBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return;
          }
        }
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );
      console.log("Temporary Order Index:", temporaryOrderIndex);

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Calculate subtotal for items with barCategory
      const barCategorySubtotal = itemsWithBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Calculate subtotal for items without barCategory
      const noBarCategorySubtotal = itemsWithoutBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      const orderData = {
        tableId: existingBill.tableId,
        sectionName: tableInfo.section.name,
        waiterName,
        // items: currentOrder.map((orderItem) => ({
        //   name: orderItem.name,
        //   quantity: orderItem.quantity,
        //   price: orderItem.price
        //     ? orderItem.price
        //     : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
        //   barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        //   selectedParentId: orderItem.selectedParentId || localStorage.getItem('selectedParentId')
        // })),
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;

          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        isTemporary: true,
        isPrint: 1,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        console.log("Creating New Order");
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Update selectedMenusList with itemsWithBarCategory
      itemsWithBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity:
              orderItem.quantity *
              parseInt(orderItem.barCategory.replace("ml", "")),
          });
        }
      });

      // Add itemsWithoutBarCategory to selectedMenusList
      itemsWithoutBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity: orderItem.quantity,
          });
        }
      });

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");

      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      const printContent = `
          <html>
              <head>
                  <title>Bill</title>
                  <style>
      @page {
        margin: 2mm; /* Adjust the margin as needed */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        box-sizing: border-box;
        margin-left: -20px;
     
      }
      * {
       
      box-sizing: border-box;
    }
      .container {
        max-width: 600px;
        padding: 10px 10px;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #fff;
      }
     
      .hotel-details p {
        text-align: center;
        margin-top: -10px;
        font-size: 12px;
      }
     
      .order_details_border {
        margin-left: 10px;
        position: relative;
        top: 2rem;
      }
     
      .container .total-section {
        justify-content: space-between;
        display: flex;
      }
     
      .margin_left_container {
        margin-left: -2rem;
      }
     
      .container {
        margin: 1rem;
        align-items: center;
        height: fit-content; /* Changed 'fit' to 'fit-content' */
      }
     
      .contact-details p {
        display: inline-block;
      }
     
      .hotel-details {
        text-align: center;
        margin-bottom: -10px;
      }
     
      .hotel-details h4 {
        font-size: 20px;
        margin-bottom: 10px;
        margin-top:-28px;
      }
     
      .hotel-details .address {
        font-size: 12px;
        margin-bottom: 10px;
      }
     
      .hotel-details p {
        font-size: 12px;
      }
     
      .contact-details {
        align-items: center;
        text-align: center;
        width: 100%;
        display: flex;
        font-size: 12.8px;
        justify-content: space-between;
      }
     
      .bill-no {
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
     
      .tableno p {
        font-size: 12.8px;
      }
     
      .waiterno p {
        font-size: 12.8px;
      }
     
      .tableAndWaiter {
        display: flex;
        align-items: center;
        font-size: 12.8px;
        justify-content: space-between;
        border-top: 1.5px dashed black;
      }
     
      .waiterno {
        /* Missing 'display: flex;' */
        display: flex;
        font-size: 12.8px;
      }
     
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
         
    .order-details{
     margin-top:14px
     font-size: 12.8px;

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 4px;
        font-size: 12.8px;
      }
     
   
     
      .margin_left_container {
        margin-left: 20px;
        font-size: 12.8px;
      }
     
      .thdots {
        border-top: 1.5px dashed black;
        padding-top: 2px;
      }
     
      .itemsQty {
        border-top: 1.5px dashed black;
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 12.8px;
      }
     
      .itemsQty p {
        margin-top: 2px;
        font-size: 12.8px;
      }
     
      .subtotal
     {
        margin-top:14px;
        font-size: 11px;
        padding-top:5px
      }
      .datas
      {
         margin-top:8px;
         font-size: 11px;
       }
      .datas {
        text-align: right;
      }
     
      .subtotal p {
        margin-top: -2px;
        margin-bottom: 5px;
        float: left;
        clear: left; /* Clear the float to ensure each heading starts on a new line */
    }
     
      .datas p {
        margin-top: -9px;
   
      }
     
      .subtotalDatas {
        display: flex;
        border-top: 1.5px dashed gray;
        justify-content: space-between;
        margin-top: -9px;
      }
     
      .grandTotal {
        font-size: 15px;
        float:right
        margin-top: 45px
     
      }
     
      .totalprice {
        text-align: right;
      }
     
      .table-class th {
        font-weight: 400;
      }
     
      .table-class th {
        align-items: center;
        text-align: left;
      }
     
      .tableAndWaiter p {
        margin-top: -10px;
      }
     
      .billNo {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .billNo p {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
       .footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

     
      .footer p {
        margin-top: -25px;
      }
     
      .datetime-containers {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 10px; /* Adjust the margin as needed */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .datetime-containers p {
        font-size: 5px;
        margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .footerss {
        margin-top: 29px;
      }
     
   
      .tableAndWaiter {
        margin-top: -7px;
      }
     
      .tableno {
        border-top: 1.5px dashed gray;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .tableno p{
        margin-top:4px
      }
      /* Align the Price column to the right */
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        text-align: right;
      }
     
      /* Center the SR column */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1) {
        text-align: center;
      }
     
      /* Set a fixed width for the SR and Price columns if needed */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1),
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        width: 31px; /* Adjust the width as needed */
      }
     .table-class{
      margin-bottom: -11px;
    }
     }
        .reduce-space {
        margin-bottom: 8px;
      }
          .reduce-margin-top {
        margin-top: -10px;
      }
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        border-top: 1.5px dashed gray;
      }
     
     
    .order-details{
     margin-top:-24px
     position:absolute

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        border-top: 1.5px dashed black;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 2px;
      }
     
      .big-text {
        display: flex;
        flex-direction: column;
      }
      .big-text span{
        font-size:12.5px
      }
        .small-text {
          font-size: 10px; /* Adjust the font size as needed */
        }
        .order-details tbody {
          margin-top: 0px; /* Set margin-top to 0 to remove extra margin */
        }

        .order-details td,
        .order-details th {
          vertical-align: middle;
        }
        .table-class td:nth-child(1) {
          text-align: left;
        }
        .table-class th:nth-child(1) {
          text-align: left;
      }
      .table-class th:nth-child(3) {
        text-align: left;
    }
    .brab{
      margin-top:-20px
    }
    .waiterName{
      margin-top: -11px;
      float: left;
      margin-bottom: -10px;

   
   
    }
    .waiterName p{
      margin-top: -1px;
      float: left;
      font-size:12.5px
   
    }
    .subtotal{
      border-top: 1.5px dashed black;

    }


  </style>
  </head>
  <div class="container">
    <div class="hotel-details">

    <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
  
    <img class="logo" src="http://localhost:5000/${
      hotelInfo.hotelLogo
    }" alt="Hotel Logo" style="max-height: 100px;max-width: 100px" />

     
        <p class="address">${
          hotelInfo ? hotelInfo.address : "Address Not Found"
        }</p>
        <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""
        }">GSTIN: ${hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""
        }">SAC No: ${hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
        }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
    </div>
   
    <!-- Content Section -->
        <!-- Table and Contact Details Section -->
        <div class="tableno reduce-space">
            <div class="billNo">
                <p>Bill No: ${
                  existingBill.length > 0
                    ? existingBill[0].orderNumber
                      ? existingBill[0].orderNumber
                      : orderNo
                    : orderNo
                }</p>
            </div>
            <p class="numberstable">Table No: ${
              tableInfo ? tableInfo.tableName : "Table Not Found"
            }</p>
        </div>
       
        <!-- Date and Time Containers Section -->
        <div class="datetime-containers">
            <span class="label">Date: <span id="date" class="datetime"></span></span>
            <span class="datetime-space"></span>
            <span class="label">Time: <span id="time" class="datetime"></span></span>
        </div>
       
        <!-- Waiter Name Section -->
        <div class="waiterName">
            <p>Waiter Name: ${waiterName}</p>
        </div>

        ${
          itemsWithBarCategory.length > 0
            ? `
       
        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
           

            <div class="subtotal">
            <p>Bar Subtotal: </p>
           
            ${
              hotelInfo && hotelInfo.vatPercentage > 0
                ? `<p>VAT (${hotelInfo.vatPercentage}%)</p>
                   <p class="grandTotal">Bar Total</p>`
                : ""
            }
        </div>
     
            <div class="datas">
                <!-- Include content or styling for AC section if needed -->
                <p>${barCategorySubtotal.toFixed(2)}</p>
               
                ${
                  hotelInfo && hotelInfo.vatPercentage > 0
                    ? `<p>${calculateTotal().VAT}</p>`
                    : ""
                }
            <p class="grandTotal">${Math.round(calculateTotal().total)}</p>
            </div>
        </div>
               `
            : ""
        }
       

               ${
                 itemsWithoutBarCategory.length > 0
                   ? `
       

        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithoutBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
            <div class="subtotal">
                <p>Menu Subtotal : </p>
                ${
                  hotelInfo && hotelInfo.gstPercentage > 0
                    ? `<p>CGST (${hotelInfo.gstPercentage / 2}%)</p> 
                     <p>SGST (${hotelInfo.gstPercentage / 2}%)</p>
                    

                     `
                    : ""
                }
            <p class=" grandTotal">Menu Total : </p>
               
            </div>

            <div class="datas">
            <p> ${noBarCategorySubtotal.toFixed(2)}</p>
            ${
              hotelInfo && hotelInfo.gstPercentage > 0
                ? `<p>${calculateTotal().CGST}</p><p>${
                    calculateTotal().SGST
                  }</p>`
                : ""
            }

           
            <p class="grandTotal"> ${Math.round(calculateTotal().menuTotal)}</p>
            </div>
        </div>
        `
                   : ""
               }

       <div class="subtotal">
       ${acPercentage > 0 ? `<p>AC (${acPercentage}%)</p>` : ""}
<p class=" grandTotal">Grand Total : </p>
</div>

            <div class="datas">
              ${
                acPercentage > 0
                  ? `<p>${calculateTotal().acPercentageAmount}</p>`
                  : ""
              }
         <p class="grandTotal"> ${Math.round(calculateTotal().grandTotal)}</p>
         </div>

        <div class="footerss">
  <div class="footer">
    <p>
      <span class="big-text">
        ${greetings.map((index) => {
          return `<span class="">
            ${index.greet}
          </span>
          <span style="${index.message ? "" : "display: none;"}">
            ${index.message}
          </span>`;
        })}
        <span class="small-text">AB Software Solution: 8888732973</span>
      </span>

    </p>


     </div>
   </div>
        </div>
        <!-- Footer Section -->
</div>

<script>
  // Function to update KOT date
  function updateKOTDate() {
    const dateElement = document.getElementById('date');
    const now = new Date();

    // Check if the current hour is before 3 AM (hour 3 in 24-hour format)
    if (now.getHours() < 3) {
      // If before 3 AM, use the previous date
      now.setDate(now.getDate() - 1);
    }

    // Format date as dd/mm/yyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;

    // Update the content of the element for KOT date
    dateElement.textContent = formattedDate;

    // Return the formatted date
    return formattedDate;
  }

  // Function to update actual current time
  function updateActualTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();

    // Format time as hh:mm:ss
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleTimeString('en-US', options);

    // Update the content of the element for actual time
    timeElement.textContent = formattedTime;
  }

  // Function to update both KOT date and actual current time
  function updateDateTime() {
    const kotDate = updateKOTDate(); // Update KOT date
    updateActualTime(); // Update actual current time

    // Optionally, you can call this function every second to update time dynamically
    setTimeout(updateDateTime, 1000);
  }

  // Call the function to update both KOT date and actual current time
  updateDateTime();
</script>
  </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(printContent);

      // Trigger the print action
      printWindow.document.close();

      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      // window.location.reload();
      // router.push("/order");
      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  // window.addEventListener("load", () => {
  //   if (localStorage.getItem("redirectAfterReload") === "true") {
  //     localStorage.removeItem("redirectAfterReload");  // Clean up the flag
  //     router.push("/order");  // Redirect to the /order page
  //   }
  // });

  if (typeof window !== "undefined") {
    window.addEventListener("load", () => {
      if (localStorage.getItem("redirectAfterReload") === "true") {
        localStorage.removeItem("redirectAfterReload"); // Clean up the flag
        router.push("/order"); // Redirect to the /order page
      }
    });
  }

  const handleCashBillLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return;
          }
        }
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );
      console.log("Temporary Order Index:", temporaryOrderIndex);

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Calculate subtotal for items with barCategory
      const barCategorySubtotal = itemsWithBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Calculate subtotal for items without barCategory
      const noBarCategorySubtotal = itemsWithoutBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      const orderData = {
        tableId: existingBill.tableId,
        sectionName,
        waiterName,
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;

          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        console.log("Creating New Order");
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Update selectedMenusList with itemsWithBarCategory
      itemsWithBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity:
              orderItem.quantity *
              parseInt(orderItem.barCategory.replace("ml", "")),
          });
        }
      });

      // Add itemsWithoutBarCategory to selectedMenusList
      itemsWithoutBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity: orderItem.quantity,
          });
        }
      });

      // After printing, update the order by cash
      const orderIdToUpdate = existingBill[temporaryOrderIndex]._id; // Assuming this is already fetched
      const cashAmount = calculateTotal().grandTotal; // Cash amount is the grand total

      // Call API to update the order with cash payment
      await axios.patch(
        `http://localhost:5000/api/order/update/update-order-by-cash/${orderIdToUpdate}`,
        {
          items: orderData.items,
          subtotal: orderData.subtotal,
          barSubtotal: orderData.barSubtotal,
          VAT: orderData.VAT,
          CGST: orderData.CGST,
          SGST: orderData.SGST,
          total: orderData.total,
          grandTotal: orderData.grandTotal,
          acPercentageAmount: orderData.acPercentageAmount,
          acPercentage: orderData.acPercentage,
          vatPercentage: orderData.vatPercentage,
          gstPercentage: orderData.gstPercentage,
          waiterName: orderData.waiterName,
          isTemporary: false,
          isPrint: 0,
          cashAmount, // Assigning the total to cashAmount
          onlinePaymentAmount: 0,
          dueAmount: 0,
          complimentaryAmount: 0,
          discount: 0,
          lastTotal: cashAmount,
        }
      );

      // Function to format the date in dd/mm/yyyy format
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Function to format the time in hh:mm:ss AM/PM format
      const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      };

      // Get the current date and time
      const currentDate = new Date();
      const {
        subtotal,
        CGST,
        SGST,
        total,
        grandTotal,
        totalQuantity,
        acPercentageAmount,
      } = calculateTotal();
      const maxItemNameLength = 20; // Max length for each line in Items column
      const ESC = "\x1b"; // ESC character
      const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
      const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off
      const CENTER_ALIGN = `${ESC}a1`; // ESC a1 centers the text
      const LEFT_ALIGN = `${ESC}a0`; // ESC a0 aligns text to the left
      // ESC/POS commands for font size
      const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
      const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

      const PAGE_WIDTH = 40; // Total width of the line

      // Function to pad spaces between label and value
      const padLabelValue = (label, value) => {
        const totalLength = label.length + value.length;
        const spacesNeeded = PAGE_WIDTH - totalLength;
        return `${label}${" ".repeat(spacesNeeded)}${value}`;
      };

      // Safeguard to ensure values are valid numbers
      const formatValue = (value) => {
        return isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);
      };
      const roundedTotal = Math.round(grandTotal); // Round up the grand total
      const formattedTotal = formatValue(roundedTotal); // Format the rounded total

      // Helper function to format a line if value is present
      const formatLine = (label, value) =>
        value > 0 ? padLabelValue(label, formatValue(value)) : "";

      const billContent = `
      ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${
        hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"
      }${NORMAL_SIZE}
      ${
        hotelInfo && hotelInfo.hotelLogo
          ? `<img class="logo" src="http://localhost:5000/${hotelInfo.hotelLogo}" alt="Hotel Logo" style="max-height: 100px; max-width: 100px;" />`
          : ""
      }
${CENTER_ALIGN}${BOLD_ON}${hotelInfo ? hotelInfo.address : "Address Not Found"}
${CENTER_ALIGN}${BOLD_ON}${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}
${hotelInfo && hotelInfo.gstNo ? `GSTIN: ${hotelInfo.gstNo}` : ""}
${hotelInfo && hotelInfo.sacNo ? `SAC No: ${hotelInfo.sacNo}` : ""}
${hotelInfo && hotelInfo.fssaiNo ? `FSSAI No: ${hotelInfo.fssaiNo}` : ""} 
  ${LEFT_ALIGN}${BOLD_ON}Bill No: ${
        existingBill.length > 0
          ? existingBill[0].orderNumber
            ? existingBill[0].orderNumber
            : orderNo
          : orderNo
      }            Table No: ${BOLD_ON}${
        tableInfo ? tableInfo.tableName : "Table Not Found"
      }             
  Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}
  ${LEFT_ALIGN}Waiter: ${
        waiterName || "         "
      }     Section: ${BOLD_ON}${sectionName}     -----------------------------------------
  SR    Items           Qty       Price
 -----------------------------------------
 ${BOLD_ON}${currentOrder
        .map((orderItem, index) => {
          const itemPrice =
            orderItem.price ||
            orderItem.pricePer?.[`pricePer${orderItem.barCategory}`];
          const formattedPrice = (itemPrice * orderItem.quantity)
            .toFixed(2)
            .padStart(8);
          let itemName = orderItem.name;
          if (itemName.length > maxItemNameLength) {
            itemName = itemName.slice(0, maxItemNameLength - 3) + "...";
          }
          // Format the first line with SR, first part of the item name, Qty, and Price
          let output = `${String(index + 1)
            .padStart(2) // SR number padded to 2 characters for alignment
            .padEnd(3)} ${itemName.padEnd(20)} ${String(
            orderItem.quantity
          ).padEnd(3)} ${formattedPrice.padStart(1)}\n`;
          return output;
        })
        .join("")} -----------------------------------------
  ${LEFT_ALIGN}Total Items: ${totalQuantity}
  -----------------------------------------
  ${padLabelValue("Subtotal:", formatValue(subtotal))}
  ${formatLine("CGST:", CGST)}
  ${formatLine("SGST:", SGST)}
  ${formatLine("AC:", acPercentageAmount)}
  ${total > 0 ? `${padLabelValue("Bar Total:", formatValue(total))}` : ""}
  -------------------------------------------
  ${LEFT_ALIGN}${padLabelValue(
        "Grand Total:",
        `${DOUBLE_SIZE_ON}${formattedTotal}${NORMAL_SIZE}`
      )}
  ${CENTER_ALIGN}${greetings
        .map((index) => {
          return `
${index.greet}
${index.message}`;
        })
        .join("")}---------------------------------------------
    AB Software Solution: 8888732973
    `;

      // You can now pass `billContent` to your print function or display it.
      // Post the formatted bill content to the print API
      console.log(billContent);
      const response = await axios.post("http://localhost:5000/print-bill", {
        billContent,
      });

      if (response.status === 200) {
        alert("Bill printed successfully");
      } else {
        alert("Failed to print the bill");
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  // online Bill
  const handleOnlineBillLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return;
          }
        }
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );
      console.log("Temporary Order Index:", temporaryOrderIndex);

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Calculate subtotal for items with barCategory
      const barCategorySubtotal = itemsWithBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Calculate subtotal for items without barCategory
      const noBarCategorySubtotal = itemsWithoutBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      const orderData = {
        tableId: existingBill.tableId,
        sectionName,
        waiterName,
        // items: currentOrder.map((orderItem) => ({
        //   name: orderItem.name,
        //   quantity: orderItem.quantity,
        //   price: orderItem.price
        //     ? orderItem.price
        //     : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
        //   barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        //   selectedParentId: orderItem.selectedParentId || localStorage.getItem('selectedParentId')
        // })),
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;

          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        console.log("Creating New Order");
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Update selectedMenusList with itemsWithBarCategory
      itemsWithBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity:
              orderItem.quantity *
              parseInt(orderItem.barCategory.replace("ml", "")),
          });
        }
      });

      // Add itemsWithoutBarCategory to selectedMenusList
      itemsWithoutBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity: orderItem.quantity,
          });
        }
      });

      console.log(orderData);
      // After printing, update the order by cash
      const orderIdToUpdate = existingBill[temporaryOrderIndex]._id; // Assuming this is already fetched
      const onlinePaymentAmount = calculateTotal().grandTotal; // Cash amount is the grand total

      // Call API to update the order with cash payment
      await axios.patch(
        `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
        {
          items: orderData.items,
          subtotal: orderData.subtotal,
          barSubtotal: orderData.barSubtotal,
          VAT: orderData.VAT,
          CGST: orderData.CGST,
          SGST: orderData.SGST,
          total: orderData.total,
          grandTotal: orderData.grandTotal,
          acPercentageAmount: orderData.acPercentageAmount,
          acPercentage: orderData.acPercentage,
          vatPercentage: orderData.vatPercentage,
          gstPercentage: orderData.gstPercentage,
          waiterName: orderData.waiterName,
          isTemporary: false,
          isPrint: 0,
          cashAmount: 0, // Assigning the total to cashAmount
          onlinePaymentAmount,
          dueAmount: 0,
          complimentaryAmount: 0,
          discount: 0,
          lastTotal: onlinePaymentAmount,
        }
      );
      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");

      // Function to format the date in dd/mm/yyyy format
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Function to format the time in hh:mm:ss AM/PM format
      const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      };

      // Get the current date and time
      const currentDate = new Date();
      const {
        subtotal,
        CGST,
        SGST,
        total,
        grandTotal,
        totalQuantity,
        acPercentageAmount,
      } = calculateTotal();
      const maxItemNameLength = 20; // Max length for each line in Items column
      const ESC = "\x1b"; // ESC character
      const BOLD_ON = `${ESC}E1`; // ESC E1 turns bold on
      const BOLD_OFF = `${ESC}E0`; // ESC E0 turns bold off
      const CENTER_ALIGN = `${ESC}a1`; // ESC a1 centers the text
      const LEFT_ALIGN = `${ESC}a0`; // ESC a0 aligns text to the left
      // ESC/POS commands for font size
      const DOUBLE_SIZE_ON = "\x1d\x21\x11"; // Double size (both width and height)
      const NORMAL_SIZE = "\x1d\x21\x00"; // Normal size

      const PAGE_WIDTH = 40; // Total width of the line

      // Function to pad spaces between label and value
      const padLabelValue = (label, value) => {
        const totalLength = label.length + value.length;
        const spacesNeeded = PAGE_WIDTH - totalLength;
        return `${label}${" ".repeat(spacesNeeded)}${value}`;
      };

      // Safeguard to ensure values are valid numbers
      const formatValue = (value) => {
        return isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);
      };
      const roundedTotal = Math.round(grandTotal); // Round up the grand total
      const formattedTotal = formatValue(roundedTotal); // Format the rounded total

      // Helper function to format a line if value is present
      const formatLine = (label, value) =>
        value > 0 ? padLabelValue(label, formatValue(value)) : "";

      const billContent = `
      ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${
        hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"
      }${NORMAL_SIZE}
      ${
        hotelInfo && hotelInfo.hotelLogo
          ? `<img class="logo" src="http://localhost:5000/${hotelInfo.hotelLogo}" alt="Hotel Logo" style="max-height: 100px; max-width: 100px;" />`
          : ""
      }
${CENTER_ALIGN}${BOLD_ON}${hotelInfo ? hotelInfo.address : "Address Not Found"}
${CENTER_ALIGN}${BOLD_ON}${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}
${hotelInfo && hotelInfo.gstNo ? `GSTIN: ${hotelInfo.gstNo}` : ""}
${hotelInfo && hotelInfo.sacNo ? `SAC No: ${hotelInfo.sacNo}` : ""}
${hotelInfo && hotelInfo.fssaiNo ? `FSSAI No: ${hotelInfo.fssaiNo}` : ""} 
  ${LEFT_ALIGN}${BOLD_ON}Bill No: ${
        existingBill.length > 0
          ? existingBill[0].orderNumber
            ? existingBill[0].orderNumber
            : orderNo
          : orderNo
      }            Table No: ${BOLD_ON}${
        tableInfo ? tableInfo.tableName : "Table Not Found"
      }             
  Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}
  ${LEFT_ALIGN}Waiter: ${
        waiterName || "         "
      }     Section: ${BOLD_ON}${sectionName}        -----------------------------------------
  SR    Items           Qty       Price
 -----------------------------------------
 ${BOLD_ON}${currentOrder
        .map((orderItem, index) => {
          const itemPrice =
            orderItem.price ||
            orderItem.pricePer?.[`pricePer${orderItem.barCategory}`];
          const formattedPrice = (itemPrice * orderItem.quantity)
            .toFixed(2)
            .padStart(8);
          let itemName = orderItem.name;
          if (itemName.length > maxItemNameLength) {
            itemName = itemName.slice(0, maxItemNameLength - 3) + "...";
          }
          // Format the first line with SR, first part of the item name, Qty, and Price
          let output = `${String(index + 1)
            .padStart(2) // SR number padded to 2 characters for alignment
            .padEnd(3)} ${itemName.padEnd(20)} ${String(
            orderItem.quantity
          ).padEnd(3)} ${formattedPrice.padStart(1)}\n`;
          return output;
        })
        .join("")} -----------------------------------------
  ${LEFT_ALIGN}Total Items: ${totalQuantity}
  -----------------------------------------
  ${padLabelValue("Subtotal:", formatValue(subtotal))}
  ${formatLine("CGST:", CGST)}
  ${formatLine("SGST:", SGST)}
  ${formatLine("AC:", acPercentageAmount)}
  ${total > 0 ? `${padLabelValue("Bar Total:", formatValue(total))}` : ""}
  -------------------------------------------
  ${LEFT_ALIGN}${padLabelValue(
        "Grand Total:",
        `${DOUBLE_SIZE_ON}${formattedTotal}${NORMAL_SIZE}`
      )}
  ${CENTER_ALIGN}${greetings
        .map((index) => {
          return `
${index.greet}
${index.message}`;
        })
        .join("")}---------------------------------------------
    AB Software Solution: 8888732973
    `;

      // You can now pass `billContent` to your print function or display it.
      // Post the formatted bill content to the print API
      console.log(billContent);
      const response = await axios.post("http://localhost:5000/print-bill", {
        billContent,
      });

      if (response.status === 200) {
        alert("Bill printed successfully");
      } else {
        alert("Failed to print the bill");
      }
      // window.location.reload();
      // router.push("/order");
      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  // cash Bill
  const handleCashBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return;
          }
        }
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );
      console.log("Temporary Order Index:", temporaryOrderIndex);

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Calculate subtotal for items with barCategory
      const barCategorySubtotal = itemsWithBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Calculate subtotal for items without barCategory
      const noBarCategorySubtotal = itemsWithoutBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      const orderData = {
        tableId: existingBill.tableId,
        sectionName: tableInfo.section.name,
        waiterName,
        // items: currentOrder.map((orderItem) => ({
        //   name: orderItem.name,
        //   quantity: orderItem.quantity,
        //   price: orderItem.price
        //     ? orderItem.price
        //     : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
        //   barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        //   selectedParentId: orderItem.selectedParentId || localStorage.getItem('selectedParentId')
        // })),
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;

          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        console.log("Creating New Order");
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Update selectedMenusList with itemsWithBarCategory
      itemsWithBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity:
              orderItem.quantity *
              parseInt(orderItem.barCategory.replace("ml", "")),
          });
        }
      });

      // Add itemsWithoutBarCategory to selectedMenusList
      itemsWithoutBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity: orderItem.quantity,
          });
        }
      });

      // After printing, update the order by cash
      const orderIdToUpdate = existingBill[temporaryOrderIndex]._id; // Assuming this is already fetched
      const cashAmount = calculateTotal().grandTotal; // Cash amount is the grand total

      // Call API to update the order with cash payment
      await axios.patch(
        `http://localhost:5000/api/order/update/update-order-by-cash/${orderIdToUpdate}`,
        {
          items: orderData.items,
          subtotal: orderData.subtotal,
          barSubtotal: orderData.barSubtotal,
          VAT: orderData.VAT,
          CGST: orderData.CGST,
          SGST: orderData.SGST,
          total: orderData.total,
          grandTotal: orderData.grandTotal,
          acPercentageAmount: orderData.acPercentageAmount,
          acPercentage: orderData.acPercentage,
          vatPercentage: orderData.vatPercentage,
          gstPercentage: orderData.gstPercentage,
          waiterName: orderData.waiterName,
          isTemporary: false,
          isPrint: 0,
          cashAmount, // Assigning the total to cashAmount
          onlinePaymentAmount: 0,
          dueAmount: 0,
          complimentaryAmount: 0,
          discount: 0,
          lastTotal: cashAmount,
        }
      );
      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");

      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      const printContent = `
           <html>
              <head>
                  <title>Bill</title>
                  <style>
      @page {
        margin: 2mm; /* Adjust the margin as needed */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        box-sizing: border-box;
        margin-left: -20px;
     
      }
      * {
       
      box-sizing: border-box;
    }
      .container {
        max-width: 600px;
        padding: 10px 10px;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #fff;
      }
     
      .hotel-details p {
        text-align: center;
        margin-top: -10px;
        font-size: 12px;
      }
     
      .order_details_border {
        margin-left: 10px;
        position: relative;
        top: 2rem;
      }
     
      .container .total-section {
        justify-content: space-between;
        display: flex;
      }
     
      .margin_left_container {
        margin-left: -2rem;
      }
     
      .container {
        margin: 1rem;
        align-items: center;
        height: fit-content; /* Changed 'fit' to 'fit-content' */
      }
     
      .contact-details p {
        display: inline-block;
      }
     
      .hotel-details {
        text-align: center;
        margin-bottom: -10px;
      }
     
      .hotel-details h4 {
        font-size: 20px;
        margin-bottom: 10px;
        margin-top:-28px;
      }
     
      .hotel-details .address {
        font-size: 12px;
        margin-bottom: 10px;
      }
     
      .hotel-details p {
        font-size: 12px;
      }
     
      .contact-details {
        align-items: center;
        text-align: center;
        width: 100%;
        display: flex;
        font-size: 12.8px;
        justify-content: space-between;
      }
     
      .bill-no {
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
     
      .tableno p {
        font-size: 12.8px;
      }
     
      .waiterno p {
        font-size: 12.8px;
      }
     
      .tableAndWaiter {
        display: flex;
        align-items: center;
        font-size: 12.8px;
        justify-content: space-between;
        border-top: 1.5px dashed black;
      }
     
      .waiterno {
        /* Missing 'display: flex;' */
        display: flex;
        font-size: 12.8px;
      }
     
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
         
    .order-details{
     margin-top:14px
     font-size: 12.8px;

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 4px;
        font-size: 12.8px;
      }
     
   
     
      .margin_left_container {
        margin-left: 20px;
        font-size: 12.8px;
      }
     
      .thdots {
        border-top: 1.5px dashed black;
        padding-top: 2px;
      }
     
      .itemsQty {
        border-top: 1.5px dashed black;
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 12.8px;
      }
     
      .itemsQty p {
        margin-top: 2px;
        font-size: 12.8px;
      }
     
      .subtotal
     {
        margin-top:14px;
        font-size: 11px;
        padding-top:5px
      }
      .datas
      {
         margin-top:8px;
         font-size: 11px;
       }
      .datas {
        text-align: right;
      }
     
      .subtotal p {
        margin-top: -2px;
        margin-bottom: 5px;
        float: left;
        clear: left; /* Clear the float to ensure each heading starts on a new line */
    }
     
      .datas p {
        margin-top: -9px;
   
      }
     
      .subtotalDatas {
        display: flex;
        border-top: 1.5px dashed gray;
        justify-content: space-between;
        margin-top: -9px;
      }
     
      .grandTotal {
        font-size: 15px;
        float:right
        margin-top: 45px
     
      }
     
      .totalprice {
        text-align: right;
      }
     
      .table-class th {
        font-weight: 400;
      }
     
      .table-class th {
        align-items: center;
        text-align: left;
      }
     
      .tableAndWaiter p {
        margin-top: -10px;
      }
     
      .billNo {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .billNo p {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
     .footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
     
      .footer p {
        margin-top: -25px;
      }
     
      .datetime-containers {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 10px; /* Adjust the margin as needed */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .datetime-containers p {
        font-size: 5px;
        margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .footerss {
        margin-top: 29px;
      }
     
   
      .tableAndWaiter {
        margin-top: -7px;
      }
     
      .tableno {
        border-top: 1.5px dashed gray;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .tableno p{
        margin-top:4px
      }
      /* Align the Price column to the right */
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        text-align: right;
      }
     
      /* Center the SR column */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1) {
        text-align: center;
      }
     
      /* Set a fixed width for the SR and Price columns if needed */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1),
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        width: 31px; /* Adjust the width as needed */
      }
     .table-class{
      margin-bottom: -11px;
    }
     }
        .reduce-space {
        margin-bottom: 8px;
      }
          .reduce-margin-top {
        margin-top: -10px;
      }
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        border-top: 1.5px dashed gray;
      }
     
     
    .order-details{
     margin-top:-24px
     position:absolute

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        border-top: 1.5px dashed black;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 2px;
      }
     
      .big-text {
        display: flex;
        flex-direction: column;
      }
      .big-text span{
        font-size:12.5px
      }
        .small-text {
          font-size: 10px; /* Adjust the font size as needed */
        }
        .order-details tbody {
          margin-top: 0px; /* Set margin-top to 0 to remove extra margin */
        }

        .order-details td,
        .order-details th {
          vertical-align: middle;
        }
        .table-class td:nth-child(1) {
          text-align: left;
        }
        .table-class th:nth-child(1) {
          text-align: left;
      }
      .table-class th:nth-child(3) {
        text-align: left;
    }
    .brab{
      margin-top:-20px
    }
    .waiterName{
      margin-top: -11px;
      float: left;
      margin-bottom: -10px;

   
   
    }
    .waiterName p{
      margin-top: -1px;
      float: left;
      font-size:12.5px
   
    }
    .subtotal{
      border-top: 1.5px dashed black;

    }


  </style>
  </head>
  <div class="container">
    <div class="hotel-details">

    <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
  
    <img class="logo" src="http://localhost:5000/${
      hotelInfo.hotelLogo
    }" alt="Hotel Logo" style="max-height: 100px;max-width: 100px" />

     
        <p class="address">${
          hotelInfo ? hotelInfo.address : "Address Not Found"
        }</p>
        <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""
        }">GSTIN: ${hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""
        }">SAC No: ${hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
        }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
    </div>
   
    <!-- Content Section -->
        <!-- Table and Contact Details Section -->
        <div class="tableno reduce-space">
            <div class="billNo">
                <p>Bill No: ${
                  existingBill.length > 0
                    ? existingBill[0].orderNumber
                      ? existingBill[0].orderNumber
                      : orderNo
                    : orderNo
                }</p>
            </div>
            <p class="numberstable">Table No: ${
              tableInfo ? tableInfo.tableName : "Table Not Found"
            }</p>
        </div>
       
        <!-- Date and Time Containers Section -->
        <div class="datetime-containers">
            <span class="label">Date: <span id="date" class="datetime"></span></span>
            <span class="datetime-space"></span>
            <span class="label">Time: <span id="time" class="datetime"></span></span>
        </div>
       
        <!-- Waiter Name Section -->
        <div class="waiterName">
            <p>Waiter Name: ${waiterName}</p>
        </div>

        ${
          itemsWithBarCategory.length > 0
            ? `
       
        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
           

            <div class="subtotal">
            <p>Bar Subtotal: </p>
           
            ${
              hotelInfo && hotelInfo.vatPercentage > 0
                ? `<p>VAT (${hotelInfo.vatPercentage}%)</p>
                   <p class="grandTotal">Bar Total</p>`
                : ""
            }
        </div>
     
            <div class="datas">
                <!-- Include content or styling for AC section if needed -->
                <p>${barCategorySubtotal.toFixed(2)}</p>
               
                ${
                  hotelInfo && hotelInfo.vatPercentage > 0
                    ? `<p>${calculateTotal().VAT}</p>`
                    : ""
                }
            <p class="grandTotal">${Math.round(calculateTotal().total)}</p>
            </div>
        </div>
               `
            : ""
        }
       

               ${
                 itemsWithoutBarCategory.length > 0
                   ? `
       

        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithoutBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
            <div class="subtotal">
                <p>Menu Subtotal : </p>
                ${
                  hotelInfo && hotelInfo.gstPercentage > 0
                    ? `<p>CGST (${hotelInfo.gstPercentage / 2}%)</p> 
                     <p>SGST (${hotelInfo.gstPercentage / 2}%)</p>
                    

                     `
                    : ""
                }
            <p class=" grandTotal">Menu Total : </p>
               
            </div>

            <div class="datas">
            <p> ${noBarCategorySubtotal.toFixed(2)}</p>
            ${
              hotelInfo && hotelInfo.gstPercentage > 0
                ? `<p>${calculateTotal().CGST}</p><p>${
                    calculateTotal().SGST
                  }</p>`
                : ""
            }

           
            <p class="grandTotal"> ${Math.round(calculateTotal().menuTotal)}</p>
            </div>
        </div>
        `
                   : ""
               }

       <div class="subtotal">
       ${acPercentage > 0 ? `<p>AC (${acPercentage}%)</p>` : ""}
<p class=" grandTotal">Grand Total : </p>
</div>

            <div class="datas">
              ${
                acPercentage > 0
                  ? `<p>${calculateTotal().acPercentageAmount}</p>`
                  : ""
              }
         <p class="grandTotal"> ${Math.round(calculateTotal().grandTotal)}</p>
         </div>

        <div class="footerss">
  <div class="footer">
    <p>
      <span class="big-text">
        ${greetings
          .map((index) => {
            return `
            <span>${index.greet}</span>
            ${
              index.message
                ? `<span class="message-text">${index.message}</span>`
                : ""
            }
          `;
          })
          .join("")}
        <span class="small-text">AB Software Solution: 8888732973</span>
      </span>
    </p>
  </div>
</div>
        </div>
        <!-- Footer Section -->
</div>

<script>
  // Function to update KOT date
  function updateKOTDate() {
    const dateElement = document.getElementById('date');
    const now = new Date();

    // Check if the current hour is before 3 AM (hour 3 in 24-hour format)
    if (now.getHours() < 3) {
      // If before 3 AM, use the previous date
      now.setDate(now.getDate() - 1);
    }

    // Format date as dd/mm/yyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;

    // Update the content of the element for KOT date
    dateElement.textContent = formattedDate;

    // Return the formatted date
    return formattedDate;
  }

  // Function to update actual current time
  function updateActualTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();

    // Format time as hh:mm:ss
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleTimeString('en-US', options);

    // Update the content of the element for actual time
    timeElement.textContent = formattedTime;
  }

  // Function to update both KOT date and actual current time
  function updateDateTime() {
    const kotDate = updateKOTDate(); // Update KOT date
    updateActualTime(); // Update actual current time

    // Optionally, you can call this function every second to update time dynamically
    setTimeout(updateDateTime, 1000);
  }

  // Call the function to update both KOT date and actual current time
  updateDateTime();
</script>
  </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(printContent);

      // Trigger the print action
      printWindow.document.close();

      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      // window.location.reload();
      // router.push("/order");
      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  // online Bill
  const handleOnlineBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return;
          }
        }
      }

      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      console.log("Existing Bill:", existingBill);
      const orderNo = orderNumber;

      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );
      console.log("Temporary Order Index:", temporaryOrderIndex);

      // Separate items into two arrays based on barCategory presence
      const itemsWithBarCategory = currentOrder.filter(
        (orderItem) => orderItem.barCategory
      );
      const itemsWithoutBarCategory = currentOrder.filter(
        (orderItem) => !orderItem.barCategory
      );

      // Calculate subtotal for items with barCategory
      const barCategorySubtotal = itemsWithBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Calculate subtotal for items without barCategory
      const noBarCategorySubtotal = itemsWithoutBarCategory.reduce(
        (total, orderItem) => {
          const itemPrice = orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
          return total + itemPrice * orderItem.quantity;
        },
        0
      );

      // Retrieve selectedParentIds and selectedMenusList from local storage
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      const orderData = {
        tableId: existingBill.tableId,
        sectionName: tableInfo.section.name,
        waiterName,
        // items: currentOrder.map((orderItem) => ({
        //   name: orderItem.name,
        //   quantity: orderItem.quantity,
        //   price: orderItem.price
        //     ? orderItem.price
        //     : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
        //   barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        //   selectedParentId: orderItem.selectedParentId || localStorage.getItem('selectedParentId')
        // })),
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;

          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
      };

      if (temporaryOrderIndex !== -1) {
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        console.log("Updating Order ID:", orderIdToUpdate);
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          { ...orderData, isTemporary: true, isPrint: 1 }
        );
        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        console.log("Creating New Order");
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Update selectedMenusList with itemsWithBarCategory
      itemsWithBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity:
              orderItem.quantity *
              parseInt(orderItem.barCategory.replace("ml", "")),
          });
        }
      });

      // Add itemsWithoutBarCategory to selectedMenusList
      itemsWithoutBarCategory.forEach((orderItem) => {
        const parentId =
          orderItem.selectedParentId ||
          localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(parentId);

        if (parentIndex !== -1) {
          selectedMenusList[parentIndex].push({
            name: orderItem.name,
            quantity: orderItem.quantity,
          });
        }
      });

      console.log(orderData);
      // After printing, update the order by cash
      const orderIdToUpdate = existingBill[temporaryOrderIndex]._id; // Assuming this is already fetched
      const onlinePaymentAmount = calculateTotal().grandTotal; // Cash amount is the grand total

      // Call API to update the order with cash payment
      await axios.patch(
        `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
        {
          items: orderData.items,
          subtotal: orderData.subtotal,
          barSubtotal: orderData.barSubtotal,
          VAT: orderData.VAT,
          CGST: orderData.CGST,
          SGST: orderData.SGST,
          total: orderData.total,
          grandTotal: orderData.grandTotal,
          acPercentageAmount: orderData.acPercentageAmount,
          acPercentage: orderData.acPercentage,
          vatPercentage: orderData.vatPercentage,
          gstPercentage: orderData.gstPercentage,
          waiterName: orderData.waiterName,
          isTemporary: false,
          isPrint: 0,
          cashAmount: 0, // Assigning the total to cashAmount
          onlinePaymentAmount,
          dueAmount: 0,
          complimentaryAmount: 0,
          discount: 0,
          lastTotal: onlinePaymentAmount,
        }
      );
      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItems");

      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      const printContent = `
            <html>
              <head>
                  <title>Bill</title>
                  <style>
      @page {
        margin: 2mm; /* Adjust the margin as needed */
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        box-sizing: border-box;
        margin-left: -20px;
     
      }
      * {
       
      box-sizing: border-box;
    }
      .container {
        max-width: 600px;
        padding: 10px 10px;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #fff;
      }
     
      .hotel-details p {
        text-align: center;
        margin-top: -10px;
        font-size: 12px;
      }
     
      .order_details_border {
        margin-left: 10px;
        position: relative;
        top: 2rem;
      }
     
      .container .total-section {
        justify-content: space-between;
        display: flex;
      }
     
      .margin_left_container {
        margin-left: -2rem;
      }
     
      .container {
        margin: 1rem;
        align-items: center;
        height: fit-content; /* Changed 'fit' to 'fit-content' */
      }
     
      .contact-details p {
        display: inline-block;
      }
     
      .hotel-details {
        text-align: center;
        margin-bottom: -10px;
      }
     
      .hotel-details h4 {
        font-size: 20px;
        margin-bottom: 10px;
        margin-top:-28px;
      }
     
      .hotel-details .address {
        font-size: 12px;
        margin-bottom: 10px;
      }
     
      .hotel-details p {
        font-size: 12px;
      }
     
      .contact-details {
        align-items: center;
        text-align: center;
        width: 100%;
        display: flex;
        font-size: 12.8px;
        justify-content: space-between;
      }
     
      .bill-no {
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
     
      .tableno p {
        font-size: 12.8px;
      }
     
      .waiterno p {
        font-size: 12.8px;
      }
     
      .tableAndWaiter {
        display: flex;
        align-items: center;
        font-size: 12.8px;
        justify-content: space-between;
        border-top: 1.5px dashed black;
      }
     
      .waiterno {
        /* Missing 'display: flex;' */
        display: flex;
        font-size: 12.8px;
      }
     
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
         
    .order-details{
     margin-top:14px
     font-size: 12.8px;

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        font-size: 12.8px;
        border-top: 1.5px dashed black;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 4px;
        font-size: 12.8px;
      }
     
   
     
      .margin_left_container {
        margin-left: 20px;
        font-size: 12.8px;
      }
     
      .thdots {
        border-top: 1.5px dashed black;
        padding-top: 2px;
      }
     
      .itemsQty {
        border-top: 1.5px dashed black;
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 12.8px;
      }
     
      .itemsQty p {
        margin-top: 2px;
        font-size: 12.8px;
      }
     
      .subtotal
     {
        margin-top:14px;
        font-size: 11px;
        padding-top:5px
      }
      .datas
      {
         margin-top:8px;
         font-size: 11px;
       }
      .datas {
        text-align: right;
      }
     
      .subtotal p {
        margin-top: -2px;
        margin-bottom: 5px;
        float: left;
        clear: left; /* Clear the float to ensure each heading starts on a new line */
    }
     
      .datas p {
        margin-top: -9px;
   
      }
     
      .subtotalDatas {
        display: flex;
        border-top: 1.5px dashed gray;
        justify-content: space-between;
        margin-top: -9px;
      }
     
      .grandTotal {
        font-size: 15px;
        float:right
        margin-top: 45px
     
      }
     
      .totalprice {
        text-align: right;
      }
     
      .table-class th {
        font-weight: 400;
      }
     
      .table-class th {
        align-items: center;
        text-align: left;
      }
     
      .tableAndWaiter p {
        margin-top: -10px;
      }
     
      .billNo {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .billNo p {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

     
      .footer p {
        margin-top: -25px;
      }
     
      .datetime-containers {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 10px; /* Adjust the margin as needed */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .datetime-containers p {
        font-size: 5px;
        margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .footerss {
        margin-top: 29px;
      }
     
   
      .tableAndWaiter {
        margin-top: -7px;
      }
     
      .tableno {
        border-top: 1.5px dashed gray;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .tableno p{
        margin-top:4px
      }
      /* Align the Price column to the right */
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        text-align: right;
      }
     
      /* Center the SR column */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1) {
        text-align: center;
      }
     
      /* Set a fixed width for the SR and Price columns if needed */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1),
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        width: 31px; /* Adjust the width as needed */
      }
     .table-class{
      margin-bottom: -11px;
    }
     }
        .reduce-space {
        margin-bottom: 8px;
      }
          .reduce-margin-top {
        margin-top: -10px;
      }
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        border-top: 1.5px dashed gray;
      }
     
     
    .order-details{
     margin-top:-24px
     position:absolute

    }

      .order-details th {
        padding: 8px;
        text-align: left;
        border-top: 1.5px dashed black;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 2px;
      }
     
      .big-text {
        display: flex;
        flex-direction: column;
      }
      .big-text span{
        font-size:12.5px
      }
        .small-text {
          font-size: 10px; /* Adjust the font size as needed */
        }
        .order-details tbody {
          margin-top: 0px; /* Set margin-top to 0 to remove extra margin */
        }

        .order-details td,
        .order-details th {
          vertical-align: middle;
        }
        .table-class td:nth-child(1) {
          text-align: left;
        }
        .table-class th:nth-child(1) {
          text-align: left;
      }
      .table-class th:nth-child(3) {
        text-align: left;
    }
    .brab{
      margin-top:-20px
    }
    .waiterName{
      margin-top: -11px;
      float: left;
      margin-bottom: -10px;

   
   
    }
    .waiterName p{
      margin-top: -1px;
      float: left;
      font-size:12.5px
   
    }
    .subtotal{
      border-top: 1.5px dashed black;

    }


  </style>
  </head>
  <div class="container">
    <div class="hotel-details">

    <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
  
    <img class="logo" src="http://localhost:5000/${
      hotelInfo.hotelLogo
    }" alt="Hotel Logo" style="max-height: 100px;max-width: 100px" />

     
        <p class="address">${
          hotelInfo ? hotelInfo.address : "Address Not Found"
        }</p>
        <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""
        }">GSTIN: ${hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""
        }">SAC No: ${hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"}</p>
        <p style="${
          !hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
        }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
    </div>
   
    <!-- Content Section -->
        <!-- Table and Contact Details Section -->
        <div class="tableno reduce-space">
            <div class="billNo">
                <p>Bill No: ${
                  existingBill.length > 0
                    ? existingBill[0].orderNumber
                      ? existingBill[0].orderNumber
                      : orderNo
                    : orderNo
                }</p>
            </div>
            <p class="numberstable">Table No: ${
              tableInfo ? tableInfo.tableName : "Table Not Found"
            }</p>
        </div>
       
        <!-- Date and Time Containers Section -->
        <div class="datetime-containers">
            <span class="label">Date: <span id="date" class="datetime"></span></span>
            <span class="datetime-space"></span>
            <span class="label">Time: <span id="time" class="datetime"></span></span>
        </div>
       
        <!-- Waiter Name Section -->
        <div class="waiterName">
            <p>Waiter Name: ${waiterName}</p>
        </div>

        ${
          itemsWithBarCategory.length > 0
            ? `
       
        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
           

            <div class="subtotal">
            <p>Bar Subtotal: </p>
           
            ${
              hotelInfo && hotelInfo.vatPercentage > 0
                ? `<p>VAT (${hotelInfo.vatPercentage}%)</p>
                   <p class="grandTotal">Bar Total</p>`
                : ""
            }
        </div>
     
            <div class="datas">
                <!-- Include content or styling for AC section if needed -->
                <p>${barCategorySubtotal.toFixed(2)}</p>
               
                ${
                  hotelInfo && hotelInfo.vatPercentage > 0
                    ? `<p>${calculateTotal().VAT}</p>`
                    : ""
                }
            <p class="grandTotal">${Math.round(calculateTotal().total)}</p>
            </div>
        </div>
               `
            : ""
        }
       

               ${
                 itemsWithoutBarCategory.length > 0
                   ? `
       

        <div class="order-details reduce-margin-top">
            <table class="table-class">
                <thead>
                    <tr>
                        <th>SR</th>
                        <th>Items</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithoutBarCategory
                      .map(
                        (orderItem, index) => `<tr key=${orderItem._id}>
                                <td>${index + 1}</td>
                                <td>${orderItem.name}</td>
                                <td>${orderItem.quantity}</td>
                                <td class="totalprice">${
                                  (orderItem.price
                                    ? orderItem.price
                                    : orderItem.pricePer[
                                        `pricePer${orderItem.barCategory}`
                                      ]) * orderItem.quantity.toFixed(2)
                                }</td>
                            </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
            <div class="subtotal">
                <p>Menu Subtotal : </p>
                ${
                  hotelInfo && hotelInfo.gstPercentage > 0
                    ? `<p>CGST (${hotelInfo.gstPercentage / 2}%)</p> 
                     <p>SGST (${hotelInfo.gstPercentage / 2}%)</p>
                    

                     `
                    : ""
                }
            <p class=" grandTotal">Menu Total : </p>
               
            </div>

            <div class="datas">
            <p> ${noBarCategorySubtotal.toFixed(2)}</p>
            ${
              hotelInfo && hotelInfo.gstPercentage > 0
                ? `<p>${calculateTotal().CGST}</p><p>${
                    calculateTotal().SGST
                  }</p>`
                : ""
            }

           
            <p class="grandTotal"> ${Math.round(calculateTotal().menuTotal)}</p>
            </div>
        </div>
        `
                   : ""
               }

       <div class="subtotal">
       ${acPercentage > 0 ? `<p>AC (${acPercentage}%)</p>` : ""}
<p class=" grandTotal">Grand Total : </p>
</div>

            <div class="datas">
              ${
                acPercentage > 0
                  ? `<p>${calculateTotal().acPercentageAmount}</p>`
                  : ""
              }
         <p class="grandTotal"> ${Math.round(calculateTotal().grandTotal)}</p>
         </div>
 <div class="footerss">
  <div class="footer">
    <p>
      <span class="big-text">
        ${greetings
          .map((index) => {
            return `
            <span>${index.greet}</span>
            ${
              index.message
                ? `<span class="message-text">${index.message}</span>`
                : ""
            }
          `;
          })
          .join("")}
        <span class="small-text">AB Software Solution: 8888732973</span>
      </span>
    </p>
  </div>
</div>
        </div>
        <!-- Footer Section -->
</div>

<script>
  // Function to update KOT date
  function updateKOTDate() {
    const dateElement = document.getElementById('date');
    const now = new Date();

    // Check if the current hour is before 3 AM (hour 3 in 24-hour format)
    if (now.getHours() < 3) {
      // If before 3 AM, use the previous date
      now.setDate(now.getDate() - 1);
    }

    // Format date as dd/mm/yyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;

    // Update the content of the element for KOT date
    dateElement.textContent = formattedDate;

    // Return the formatted date
    return formattedDate;
  }

  // Function to update actual current time
  function updateActualTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();

    // Format time as hh:mm:ss
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleTimeString('en-US', options);

    // Update the content of the element for actual time
    timeElement.textContent = formattedTime;
  }

  // Function to update both KOT date and actual current time
  function updateDateTime() {
    const kotDate = updateKOTDate(); // Update KOT date
    updateActualTime(); // Update actual current time

    // Optionally, you can call this function every second to update time dynamically
    setTimeout(updateDateTime, 1000);
  }

  // Call the function to update both KOT date and actual current time
  updateDateTime();
</script>
  </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(printContent);

      // Trigger the print action
      printWindow.document.close();

      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      // window.location.reload();
      // router.push("/order");
      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      // Handle errors
      console.error("Error preparing order:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      console.log("Current Order:", currentOrder);

      // Fetch stock data
      const stockResponse = await axios.get(
        "http://localhost:5000/api/liquorBrand/liquorBrand/stock"
      );
      const stockData = stockResponse.data;

      // Function to get stock quantity and stock quantity in milliliters for a given item name
      const getStockDetails = (itemName) => {
        for (const brand of stockData) {
          const foundItem = brand.menuStock.find(
            (menuItem) => menuItem.name === selectedParentId
          );
          if (foundItem) {
            return {
              stockQtyMl: foundItem.stockQtyMl,
              barCategoryMl: parseInt(
                foundItem.barCategory.replace("ml", ""),
                10
              ),
            };
          }
        }
        return null;
      };

      // Check stock quantities before proceeding
      for (const orderItem of modifiedCurrentOrder) {
        const stockDetails = getStockDetails(orderItem.name);
        if (stockDetails) {
          const totalOrderMl = orderItem.quantity * stockDetails.barCategoryMl;
          if (totalOrderMl > stockDetails.stockQtyMl) {
            alert(
              `Insufficient stock for item ${selectedParentId}. Available stock: ${stockDetails.stockQtyMl} ml`
            );
            return; // Exit the function if stock is insufficient
          }
        }
      }

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
      const selectedSection =
        JSON.parse(localStorage.getItem("selectedSection")) || {};
      const sectionName = selectedSection.sectionName || "";

      // Prepare order data
      const orderData = {
        tableId: tableId,
        waiterName,
        sectionName: tableInfo.section.name,
        items: currentOrder.map((orderItem) => {
          // const storedParentId = localStorage.getItem('selectedParentId');
          // const selectedParentId = orderItem.selectedParentId || storedParentId;
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          ); // Slicing orderItem.name
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" ")); // Slicing parentId
            console.log(
              `Checking parentId: "${parentId}" sliced to: "${slicedParentId}" against orderItem.name: "${slicedOrderItemName}"`
            );
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];
          console.log(selectedParentId);

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId, // Include the selectedParentId in the request body
          };
        }),
        subtotal: calculateTotal().subtotal,
        barSubtotal: calculateTotal().barSubtotal,
        VAT: calculateTotal().VAT,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount,
        total: calculateTotal().total,
        menuTotal: calculateTotal().menuTotal,
        grandTotal: calculateTotal().grandTotal,
        acPercentage: acPercentage,
        vatPercentage: hotelInfo ? hotelInfo.vatPercentage : 0,
        gstPercentage: hotelInfo ? hotelInfo.gstPercentage : 0,
        isTemporary: true,
        isPrint: 1,
      };
      console.log("Order Data to Save:", orderData);

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `http://localhost:5000/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      if (existingBill && existingBill.length > 0) {
        const orderIdToUpdate = existingBill[0]._id;
        await axios.patch(
          `http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );

        await axios.patch(
          `http://localhost:5000/api/kot/kot/settle/${tableId}`
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/order/order/${tableId}`,
          orderData
        );
      }

      // Retrieve selectedParentIds and selectedMenusList from local storage

      const existingItemsMap = new Map();
      if (existingBill && existingBill.length > 0) {
        existingBill[0].items.forEach((item) => {
          existingItemsMap.set(item.name, item);
        });
      }

      let hasDifferences = false;
      for (const orderItem of currentOrder) {
        const existingItem = existingItemsMap.get(orderItem.name);
        if (existingItem) {
          if (orderItem.quantity !== existingItem.quantity) {
            hasDifferences = true;
            break;
          }
        } else {
          hasDifferences = true;
          break;
        }
      }

      if (
        hasDifferences &&
        selectedParentIds.length > 0 &&
        selectedMenusList.length > 0
      ) {
        await axios.post(
          `http://localhost:5000/api/liquorBrand/liquorBrand/stockOut`,
          {
            selectedParentIds,
            selectedMenusList,
          }
        );
      }

      // Clean up local storage
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedItem");
      localStorage.removeItem("selectedMenusList");

      // Redirect to order page
      router.push("/order");
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const handleAfterPrint = () => {
    window.removeEventListener("afterprint", handleAfterPrint);
    window.close();
  };

  const updateOrder = (updatedOrderItem) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.name === updatedOrderItem.name ? updatedOrderItem : item
      );
      console.log(updatedOrder); // Log the updated order
      return updatedOrder;
    });
  };

  const handleQuantityChange = (e, orderItem) => {
    let newQuantity = e.target.value;

    // Handle backspace
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      newQuantity = newQuantity.slice(0, -1);
    }

    if (newQuantity === "" || isNaN(newQuantity) || newQuantity < 0) {
      newQuantity = "";
    } else {
      newQuantity = parseInt(newQuantity, 10);
    }

    const updatedOrderItem = { ...orderItem, quantity: newQuantity };
    console.log(updatedOrderItem);
    updateOrder(updatedOrderItem);
  };

  const addToOrder = useCallback(
    (product) => {
      // Determine if the product is a bar menu
      const isBarMenu = !!product.barCategory;

      // Retrieve existing data from local storage
      const localStorageSelectedParentId =
        localStorage.getItem("selectedParentId");
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      // Use selectedParentId from state if available, otherwise from local storage
      const effectiveSelectedParentId =
        selectedParentId || localStorageSelectedParentId;

      if (isBarMenu && !effectiveSelectedParentId) {
        console.error("No parentId found for bar menu.");
        return; // Parent ID is required for bar menus
      }

      if (isBarMenu) {
        // Find the parent index corresponding to the selected parent ID
        const parentIndex = selectedParentIds.indexOf(
          effectiveSelectedParentId
        );
        if (parentIndex === -1) {
          console.error(
            `Parent ID ${effectiveSelectedParentId} not found in selectedParentIds.`
          );
          return;
        }

        // Update selectedMenusList in local storage
        const existingMenuIndex = selectedMenusList[parentIndex].findIndex(
          (menuItem) => menuItem.name === product.name
        );

        if (existingMenuIndex !== -1) {
          // If the menu item already exists, update its quantity
          selectedMenusList[parentIndex][existingMenuIndex].quantity +=
            parseInt(product.barCategory.replace("ml", ""));
        } else {
          // If it's a new menu item, add it to the list
          selectedMenusList[parentIndex].push({
            name: product.name,
            quantity: parseInt(product.barCategory.replace("ml", "")),
          });
        }

        // Store the updated menus list in local storage
        localStorage.setItem(
          "selectedMenusList",
          JSON.stringify(selectedMenusList)
        );
      }

      // Update the current order
      setCurrentOrder((prevOrder) => {
        // Check if the product already exists in the order
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        let updatedOrder;
        if (existingItem) {
          // If the same menu item is selected, increase its quantity
          updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // If the item is not already in the order, add it
          updatedOrder = [
            ...prevOrder,
            {
              ...product,
              quantity: 1,
            },
          ];
        }

        return updatedOrder;
      });
    },
    [setCurrentOrder, selectedParentId] // Ensure selectedParentId is included in the dependency array
  );

  const removeFromOrder = (product) => {
    const isBarMenu = !!product.barCategory;

    const localStorageSelectedParentId =
      localStorage.getItem("selectedParentId");
    const selectedParentIds =
      JSON.parse(localStorage.getItem("selectedParentIds")) || [];
    const selectedMenusList =
      JSON.parse(localStorage.getItem("selectedMenusList")) || [];

    const effectiveSelectedParentId =
      selectedParentId || localStorageSelectedParentId;

    if (isBarMenu && !effectiveSelectedParentId) {
      console.error("No parentId found for bar menu.");
      return;
    }

    if (isBarMenu) {
      const parentIndex = selectedParentIds.indexOf(effectiveSelectedParentId);
      if (parentIndex === -1) {
        console.error(
          `Parent ID ${effectiveSelectedParentId} not found in selectedParentIds.`
        );
        return;
      }

      const existingMenuIndex = selectedMenusList[parentIndex].findIndex(
        (menuItem) => menuItem.name === product.name
      );

      if (existingMenuIndex !== -1) {
        const existingQuantity =
          selectedMenusList[parentIndex][existingMenuIndex].quantity;
        const reductionAmount = parseInt(product.barCategory.replace("ml", ""));

        if (existingQuantity > reductionAmount) {
          selectedMenusList[parentIndex][existingMenuIndex].quantity -=
            reductionAmount;
        } else {
          selectedMenusList[parentIndex].splice(existingMenuIndex, 1);
        }

        if (selectedMenusList[parentIndex].length === 0) {
          selectedMenusList.splice(parentIndex, 1);
          selectedParentIds.splice(parentIndex, 1);
        }

        localStorage.setItem(
          "selectedMenusList",
          JSON.stringify(selectedMenusList)
        );
        localStorage.setItem(
          "selectedParentIds",
          JSON.stringify(selectedParentIds)
        );
      }
    }

    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.name === product.name);

      if (existingItem) {
        const updatedOrder = prevOrder.map((item) =>
          item.name === existingItem.name
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        );

        const filteredOrder = updatedOrder.filter((item) => item.quantity > 0);

        return filteredOrder;
      } else {
        return prevOrder;
      }
    });
  };

  useEffect(() => {
    // Recalculate total when isACEnabled changes
    setCurrentOrder((prevOrder) => [...prevOrder]); // Trigger a re-render
  }, [isACEnabled]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Fetch categories
    axios
      .get("http://localhost:5000/api/main/hide")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get("http://localhost:5000/api/liquorCategory/barMenus")
      .then((response) => {
        setBarCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch products
    axios
      .get("http://localhost:5000/api/menu/menus/list")
      .then((response) => {
        // console.log(response.data);
        const menusArray = response.data; // Ensure menus is an array
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // axios
    //   .get("http://localhost:5000/api/liquorBrand/barSubmenu/list")
    //   .then((response) => {
    //     console.log(response.data);
    //     const menusArray = response.data; // Ensure menus is an array
    //     setBarMenus(menusArray);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching products:", error);
    //   });

    if (tableId) {
      axios
        .get(`http://localhost:5000/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);

          // Fetch saved bills for the table from the API
          axios
            .get(`http://localhost:5000/api/order/savedBills/${tableId}`)
            .then((response) => {
              const savedBills = response.data;
              if (savedBills.length > 0) {
                // Assuming you want to load the latest saved bill
                const latestOrder = savedBills[savedBills.length - 1];
                setCurrentOrder(latestOrder.items || []); // Initialize currentOrder with the saved items
                setWaiterName(latestOrder.waiterName);
                setSectionName(latestOrder.sectionName);
              }
            })
            .catch((error) => {
              console.error("Error fetching saved bills:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }

    document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener('keydown', handleSlashKey);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // document.removeEventListener('keydown', handleSlashKey);
    };
  }, [tableId, handleKeyDown]);

  useEffect(() => {
    const handleStarKey = (event) => {
      if (event.key === "*") {
        event.preventDefault();
        handlePrintBill();
      }
    };
    document.addEventListener("keydown", handleStarKey);
    return () => {
      document.removeEventListener("keydown", handleStarKey);
    };
  }, [handlePrintBill]);

  useEffect(() => {
    const handleSlashKey = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        saveBill();
      }
    };
    document.addEventListener("keydown", handleSlashKey);
    return () => {
      document.removeEventListener("keydown", handleSlashKey);
    };
  }, [saveBill]);

  useEffect(() => {
    const handleHomeKey = (event) => {
      if (event.key === "Home") {
        event.preventDefault();
        WaitingBill(); // Call your end function here
      }
    };
    document.addEventListener("keydown", handleHomeKey);

    return () => {
      document.removeEventListener("keydown", handleHomeKey);
    };
  }, [WaitingBill]);

  useEffect(() => {
    const handleDotKey = (event) => {
      if (event.key === ".") {
        event.preventDefault();
        saveKot(); // Call your function here
      }
    };

    document.addEventListener("keydown", handleDotKey);

    return () => {
      document.removeEventListener("keydown", handleDotKey);
    };
  }, [saveKot]);

  useEffect(() => {
    const handlePageUpKey = (event) => {
      if (event.key === "PageUp") {
        event.preventDefault();
        handleSave(); // Call your function here
      }
    };

    document.addEventListener("keydown", handlePageUpKey);

    return () => {
      document.removeEventListener("keydown", handlePageUpKey);
    };
  }, [handleSave]);

  useEffect(() => {
    const handlePageDownKey = (event) => {
      if (event.key === "PageDown") {
        event.preventDefault();
        openCloseTablesModal(); // Call your function here
      }
    };

    document.addEventListener("keydown", handlePageDownKey);

    return () => {
      document.removeEventListener("keydown", handlePageDownKey);
    };
  }, [openCloseTablesModal]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedCategory) {
      axios
        .get(`http://localhost:5000/api/menu/${selectedCategory._id}`)
        .then((response) => {
          console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedBarCategory) {
      axios
        .get(`http://localhost:5000/api/liquorBrand/${selectedBarCategory._id}`)
        .then((response) => {
          // console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setBarMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedBarCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedBarCategory(null); // Reset bar category
    setShowCategoryMenus(true); // Set this to true to ensure category menus are shown
    setShowBarCategoryMenus(false); // Set this to false to hide bar category menus
    setSelectedBarMenuItem(false);
    setShowBrandMenus(false);

    // If the category is null (All items), fetch all menus
    if (category === null) {
      axios
        .get("http://localhost:5000/api/menu/menus/list")
        .then((response) => {
          console.log(response.data);
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      // Fetch menus based on the selected category
      axios
        .get(`http://localhost:5000/api/menu/menulist/${category._id}`)
        .then((response) => {
          console.log(response.data);
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  const handleBarCategoryClick = (category) => {
    setSelectedBarCategory(category);
    setSelectedCategory(null); // Reset regular category
    setShowCategoryMenus(false); // Set this to false to hide category menus when selecting from bar categories
    setShowBarCategoryMenus(true); // Set this to false to hide bar category menus
    setShowBarMenus(true);
    setSelectedBarMenuItem(false);
    setShowBrandCategoryMenus(true);
    // setShowBrands(false)
    setShowBrandMenus(false);

    // If the category is null (All items), fetch all menus
    if (category === null) {
      axios
        .get("http://localhost:5000/api/liquorBrand/barSubmenu/list")
        .then((response) => {
          console.log(response.data);
          setBarMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      // Fetch menus based on the selected category
      axios
        .get(`http://localhost:5000/api/liquorBrand/${category._id}`)
        .then((response) => {
          console.log(response.data);
          setBarMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  const calculateTotal = () => {
    const itemsWithBarCategory = currentOrder.filter(
      (orderItem) => orderItem.barCategory
    );
    const itemsWithoutBarCategory = currentOrder.filter(
      (orderItem) => !orderItem.barCategory
    );

    // Calculate subtotal for items with barCategory and items without barCategory separately
    const subtotalWithBarCategory = itemsWithBarCategory.reduce(
      (acc, orderItem) => {
        const price = orderItem.price
          ? orderItem.price
          : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
        return acc + price * orderItem.quantity;
      },
      0
    );

    const subtotalWithoutBarCategory = itemsWithoutBarCategory.reduce(
      (acc, orderItem) => {
        const price = orderItem.price
          ? orderItem.price
          : orderItem.pricePer[`pricePer${orderItem.barCategory}`];
        return acc + price * orderItem.quantity;
      },
      0
    );

    // Calculate VAT for items with barCategory
    const VATRate = isVATEnabled ? vatPercentage / 100 : 0; // Use VAT percentage if enabled
    const VAT = VATRate * subtotalWithBarCategory;

    // Calculate GST for items without barCategory
    const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0; // Use GST percentage if enabled
    const CGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for CGST
    const SGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for SGST

    // Include acPercentage in the total calculation
    const acPercentageAmount = isACEnabled
      ? (subtotalWithBarCategory + subtotalWithoutBarCategory) *
        (acPercentage / 100)
      : 0;

    const menuTotal = subtotalWithoutBarCategory + CGST + SGST;
    const total = subtotalWithBarCategory + VAT;
    const grandTotal = menuTotal + total + acPercentageAmount;

    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    return {
      subtotal: subtotalWithoutBarCategory.toFixed(2),
      barSubtotal: subtotalWithBarCategory.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      VAT: VAT.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acPercentageAmount: acPercentageAmount.toFixed(2), // AC percentage amount based on subtotal
      total: total.toFixed(2),
      menuTotal: menuTotal.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const handleMenuItemKeyDown = (event, product) => {
    if (event.key === "Enter") {
      addToOrder(product);
    } else if (event.key === "+") {
      event.preventDefault();
      setSearchInput("");

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (event.key === "-") {
      event.preventDefault();
      removeFromOrder(product);
    }
  };

  const [gstPercentage, setGSTPercentage] = useState(0); // Add this line for the GST percentage
  const [vatPercentage, setVATPercentage] = useState(0); // Add this line for the GST percentage

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
          // console.log(hotelInfo);
          setHotelInfo(hotelInfo);
          setGSTPercentage(hotelInfo.gstPercentage || 0);
          setVATPercentage(hotelInfo.vatPercentage || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const [ProductName, setProductName] = useState("");

  //run well
  const handleCheckboxChange = (itemName) => {
    setSelectedMenuNames((prevSelectedMenuNames) => {
      const isSelected = prevSelectedMenuNames.includes(itemName);
      return isSelected
        ? prevSelectedMenuNames.filter((name) => name !== itemName)
        : [...prevSelectedMenuNames, itemName];
    });
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsResponse = await axios.get(
          "http://localhost:5000/api/section"
        );
        setSections(sectionsResponse.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  const displaySectionsForSelection = sections.map((section) => (
    <option key={section._id} value={section._id}>
      {section.name}
    </option>
  ));

  const displaySectionsForSelectionSplit = sections.map((section) => (
    <option key={section._id} value={section.name}>
      {section.name}
    </option>
  ));

  const handleMergeTables = async (
    sectionId,
    destinationTableName,
    sourceTableName
  ) => {
    try {
      // Perform a lookup in the Table collection to retrieve tableId for destinationTableName
      const destinationTableResponse = await axios.get(
        `http://localhost:5000/api/table/table/bySectionAndName/${sectionId}/${destinationTableName}`
      );
      const destinationTableId = destinationTableResponse.data._id;
      console.log(destinationTableId);

      // Perform a lookup in the Table collection to retrieve tableId for sourceTableName
      const sourceTableResponse = await axios.get(
        `http://localhost:5000/api/table/table/bySectionAndName/${sectionId}/${sourceTableName}`
      );
      const sourceTableId = sourceTableResponse.data._id;

      // Call the mergeTables endpoint with the retrieved tableIds
      const response = await axios.patch(
        "http://localhost:5000/api/order/mergeTables",
        {
          destinationTableId,
          sourceTableId,
        }
      );
      console.log(response.data); // Handle response data as needed
      setIsNewModalOpen(false);
      router.push(`/order/${destinationTableId}`);
    } catch (error) {
      console.error("Error merging tables:", error);
      setErrorMessageMerge("Not Allowed to merge tables");
      setIsErrorModalOpenMerge(true); // Open the error modal
    }
  };

  const handleShiftTables = async (
    sourceSectionId,
    sourceTableName,
    destinationSectionId,
    destinationTableName
  ) => {
    try {
      // Perform a lookup in the Table collection to retrieve tableId for destinationTableName in destinationSectionId
      const destinationTableResponse = await axios.get(
        `http://localhost:5000/api/table/table/bySectionAndName/${destinationSectionId}/${destinationTableName}`
      );
      const destinationTableId = destinationTableResponse.data._id;

      // Perform a lookup in the Table collection to retrieve tableId for sourceTableName in sourceSectionId
      const sourceTableResponse = await axios.get(
        `http://localhost:5000/api/table/table/bySectionAndName/${sourceSectionId}/${sourceTableName}`
      );
      const sourceTableId = sourceTableResponse.data._id;

      // Call the shiftTables endpoint with the retrieved tableIds
      const response = await axios.patch(
        "http://localhost:5000/api/order/shiftBills",
        {
          destinationTableId,
          sourceTableId,
        }
      );
      console.log(response.data); // Handle response data as needed
      setIsShiftModalOpen(false);

      router.push(`/order/${destinationTableId}`);
    } catch (error) {
      console.error("Error shifting tables:", error);
      setErrorMessageMerge("Not Allowed to Shift tables");
      setIsErrorModalOpenMerge(true); // Open the error modal
    }
  };

  const home = () => {
    router.push("/dashboard");
  };

  const showTables = () => {
    router.push("/bill");
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === "\\") {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // console.log("selectedBarMenuItem:", selectedBarMenuItem);

  return (
    <>
      <OrderSidebar />
      <div className=" font-sans mt-16">
        {showPopup && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-2xl z-50 rounded-lg border border-blue-700">
            <div className="text-center">
              <p className="mb-4">
                Stock Quantity is not available for{" "}
                <b>
                  <i>{ProductName}</i>
                </b>
                !{" "}
              </p>
              <button
                className=" bg-blue-200  hover:bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded-full mr-2"
                onClick={closePopup}
              >
                Ok
              </button>
            </div>
          </div>
        )}

        {isCancelKotModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-base font-semibold mb-4 text-red-600">
                Please select items for cancel KOT/BOT.
              </h2>
            </div>
          </div>
        )}

        {/* <!-- component --> */}
        <div className="  ml-7">
          <div className="flex lg:flex-row shadow-lg">
            <div className=" w-56 lg:w-[64.40%] md:w-[58.70%] lg:pl-3 md:pl-3 hidden md:block bg-white ">
              <div className="">
                <Try />
              </div>
              <div className=" grid gap-1 grid-cols-4 lg:grid-cols-4 w-96  md:grid-cols-4 text-left ml-4  mt-1 lg:mt-2 mb-3">
                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400 "
                  onClick={() => setIsNewModalOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faDownLeftAndUpRightToCenter}
                    className="mr-2"
                  />
                  Merge
                </button>

                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                  onClick={() => setIsShowModalOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faArrowsSplitUpAndLeft}
                    className="mr-2"
                  />
                  Split
                </button>

                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                  onClick={() => setIsRestoreModalOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faDiagramPredecessor}
                    className="mr-2"
                  />
                  UnSplit
                </button>
                <button
                  className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                  onClick={() => setIsShiftModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faDiagramNext} className="mr-2" />
                  Shift
                </button>
              </div>
              <div className="flex flex-row px-2 ml-1 justify-start flex-wrap">
                <span
                  key="all-items"
                  className={`cursor-pointer mb-2 px-4 rounded-xl p-1 hover:text-[#ffffff] hover:bg-[#387478]
                     text-xs lg:text-sm font-semibold mr-2 flex items-center justify-center ${
                       selectedCategory === null
                         ? "bg-[#629584] text-white"
                         : ""
                     }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  All Menus
                </span>
                {categories
                  .slice(0, showMore ? categories.length : 4)
                  .map((category) => (
                    <span
                      key={category._id}
                      className={`bg-[#E2F1E7] hover:bg-[#387478] hover:text-[#ffffff] cursor-pointer px-5 ml-1 mr-2 py-1 mb-2 rounded-xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                        selectedCategory === category
                          ? "bg-[#387478] text-white"
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <span className="flex items-center justify-center w-full h-full">
                        {category.name}
                      </span>
                    </span>
                  ))}

                {categories.length > 4 && (
                  <div className="flex items-center -mt-1">
                    <button
                      className="  h-7 w-7 flex items-center justify-center rotate-90 cursor-pointer rounded-lg
                       bg-[#E2F1E7] hover:bg-[#387478] hover:text-[#ffffff]  p-0.5"
                      onClick={handleToggleButton}
                    >
                      <FontAwesomeIcon
                        icon={showMore ? faAngleDown : faAngleUp}
                        size="sm"
                      />
                    </button>
                  </div>
                )}
              </div>

              {userRole === "adminBar" && (
                <div className="flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap mt-1">
                  <span
                    key="all-items"
                    className={`cursor-pointer px-4 py-1 hover:text-[#ffffff] hover:bg-[#387478] mb-1 rounded-xl text-xs lg:text-sm font-semibold  ${
                      selectedBarCategory === null
                        ? "bg-[#629584] text-white"
                        : ""
                    } ${!tableId ? "cursor-not-allowed opacity-50" : ""}`} // Disabled styling
                    onClick={
                      tableId ? () => handleBarCategoryClick(null) : null
                    } // Conditional onClick handler
                  >
                    All Bar Menu
                  </span>

                  {barCategories.map((category) => (
                    <span
                      key={category._id}
                      className={`whitespace-nowrap bg-[#E2F1E7] hover:bg-[#387478] hover:text-[#ffffff]  cursor-pointer px-5 ml-3 py-1 mb-1 rounded-xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                        selectedBarCategory === category
                          ? "bg-[#387478]  text-white"
                          : ""
                      }`}
                      onClick={() => handleBarCategoryClick(category)}
                    >
                      {category.liquorCategory}
                    </span>
                  ))}
                </div>
              )}

              <div className=" flex justify-start px-5 -ml-2 mt-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Menu / Id..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none
                   focus:border-gray-500 w-18 lg:w-40 md:w-44
               text-xs -ml-4 lg:ml-0 md:ml-0 lg:text-sm md:text-sm"
                />
              </div>

              {/* menus  */}
              {showCategoryMenus && (
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-5 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(67vh-1rem)] md:max-h-[calc(55vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {(menus.menus || menus)
                    .filter(filterMenus) // Apply the filterMenus function
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between
                         text-sm lg:h-24 md:h-20 cursor-pointer"
                        onClick={() => addToOrder(product)}
                        tabIndex={0}
                        ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                        onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                      >
                        <div>
                          <div className="lg:-mt-3 ">
                            <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap ">
                              {product.uniqueId}
                            </span>
                            <span
                              className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap "
                              style={{ fontSize: "12px" }}
                            >
                              ₹{product.price}
                            </span>
                          </div>

                          <div className="justify-center  flex">
                            <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-5 lg:flex justify-between">
                              <span
                                className="md:text-xs sm:text-xs lg:mb-1 flex font-bold"
                                style={{ fontSize: "15px" }}
                              >
                                <i>{product.name}</i>
                              </span>
                              <span>
                                {product.stockQty > 0 && (
                                  <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                    Q: {product.stockQty}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {showBarCategoryMenus && showBarMenus && (
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-5 gap-3 lg:px-3 md:px-2 px-2 mt-2 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {(
                    barMenus &&
                    (Array.isArray(barMenus) ? barMenus : barMenus.barMenus)
                  )
                    ?.filter(filterMenus)
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20"
                        tabIndex={0}
                        onClick={() => handleClickBarMenuItem(product)}
                      >
                        <div>
                          <div className="lg:-mt-3">
                            <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                              {/* {product.uniqueId} */}
                            </span>
                            <span
                              className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              {/* ₹{product.pricePer1Bottle} */}
                            </span>
                          </div>
                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/wine.jpg`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 -ml-1 md:mt-4"
                              } hidden lg:block`}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-xs sm:text-xs lg:mb-1 flex font-bold"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {selectedBarMenuItem && (
                <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] ">
                  {/* Render prices grid here */}

                  <div className="mb-4 ml-3 flex">
                    <p className="text-left font-bold mt-1">
                      Choose Bottle to Sell / Pour
                    </p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer ml-4"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected childMenuId
                    >
                      <option value="">Select Bottle to Sell / Pour</option>

                      {selectedBarMenuItem.childMenus
                        .filter(
                          (childMenu) =>
                            parseInt(childMenu.barCategory.replace("ml", "")) >=
                              90 &&
                            childMenu.stockQty > 0 &&
                            Object.values(childMenu.pricePer).some(
                              (price) => price > 1
                            )
                        ) // Filter based on barCategory > 90ml
                        .map((childMenu) => (
                          <option key={childMenu._id} value={childMenu.name}>
                            {childMenu.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {selectedOptionForBar && (
                    <div
                      className="grid grid-cols-4 gap-4 p-4"
                      key={selectedBarMenuItem._id}
                    >
                      {/* Render child menu prices */}
                      {selectedBarMenuItem.childMenus.map((childMenu) => {
                        if (
                          childMenu.barCategory &&
                          childMenu.pricePer[
                            `pricePer${childMenu.barCategory}`
                          ] > 0
                        ) {
                          // Check if stockQtyStr exists and is not undefined
                          const stockQtyStr = childMenu.stockQtyStr
                            ? childMenu.stockQtyStr
                            : "0";

                          // Split the stockQtyStr into bottles and ml
                          const [stockQtyBottles, stockQtyMl] =
                            stockQtyStr.split(".");

                          // Check if stockQtyBottles is greater than 0
                          const stockQty = parseInt(stockQtyBottles);
                          const showStockQty = stockQty > 0;

                          return (
                            <div
                              key={childMenu._id}
                              className="bg-[#beeccd] hover:bg-[#629584] p-2 rounded-md hover:text-white text-gray-900 text-sm cursor-pointer h-24"
                              onClick={() => addToOrder(childMenu)}
                            >
                              {showStockQty && (
                                <p className="text-center font-bold text-xs text-white mb-1 
                                bg-[#629584] rounded-md p-1">
                                  <i>
                                    {stockQtyBottles} Bottles{" "}
                                    {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                  </i>
                                </p>
                              )}
                              <p className="text-center font-bold mt-1">
                                <i>{selectedBarMenuItem.name}</i>
                              </p>
                              <p className="text-center font-extrabold">
                                {childMenu.barCategory}
                              </p>
                              {/* Render the price dynamically */}
                              <p className="text-center font-semibold ">
                                ₹
                                {
                                  childMenu.pricePer[
                                    `pricePer${childMenu.barCategory}`
                                  ]
                                }
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              )}

              {showBrandCategoryMenus && (
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-5 gap-3 lg:px-3 md:px-2 px-2 -mt-1.5 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                  {selectedBarCategory &&
                    barMenus.brands?.map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20"
                        onClick={() => handleClickBrandMenuItem(product)}
                        tabIndex={0}
                        ref={(el) => (menuItemRefs.current[index] = el)}
                        onKeyDown={(e) => handleMenuItemKeyDown(e, product)}
                      >
                        <div>
                          <div className="lg:-mt-3">
                            <span className="text-orange-500 md:text-xs text-sm font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                              {product.uniqueId}
                            </span>
                            <span
                              className="float-right text-green-700 text-sm md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                              style={{ fontSize: "12px" }}
                            >
                              {product.price}
                            </span>
                          </div>
                          <div className="justify-center flex">
                            <img
                              src={
                                product.imageUrl
                                  ? `http://localhost:5000/${product.imageUrl}`
                                  : `/wine.jpg`
                              }
                              className={`object-cover rounded-md ${
                                product.imageUrl
                                  ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                  : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 -ml-1 md:mt-4"
                              } hidden lg:block`}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                          <span
                            className="md:text-xs sm:text-xs lg:mb-1 flex font-bold"
                            style={{ fontSize: "12px" }}
                          >
                            <i>{product.name}</i>
                          </span>
                          <span>
                            {product.stockQty > 0 && (
                              <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                Q: {product.stockQty}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {selectedBrandMenuItem && showBrandMenus && (
                <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] cursor-pointer h-96">
                  <div className="mb-2 ml-5 flex">
                    <p className="text-left font-bold">
                      Choose Bottle to Sell / Pour
                    </p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ml-4 cursor-pointer"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected parentMenuId
                    >
                      <option value="">Select Bottle to Sell / Pour</option>

                      {selectedBrandMenuItem.prices
                        .filter(
                          (price) =>
                            parseInt(price.barCategory.replace("ml", "")) >=
                              90 && price.stockQty > 0 // Filter condition to check if stockQty is greater than 0
                        )
                        .map((price) => (
                          <option
                            key={price._id}
                            value={price.name}
                            className="cursor-pointer"
                          >
                            {" "}
                            {price.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {selectedOptionForBar && (
                    <div
                      className="grid grid-cols-4 gap-4 p-4"
                      key={selectedBrandMenuItem?._id}
                    >
                      {/* Render child menu prices */}
                      {selectedBrandMenuItem?.prices &&
                        selectedBrandMenuItem.prices.map((price) => {
                          if (price && price.price > 0) {
                            // Check if stockQtyStr exists and is not undefined
                            const stockQtyStr = price.stockQtyStr || "0";

                            // Split the stockQtyStr into bottles and ml
                            const [stockQtyBottles, stockQtyMl] =
                              stockQtyStr.split(".");

                            // Check if stockQtyBottles is greater than 0
                            const stockQty = parseInt(stockQtyBottles);
                            const showStockQty = stockQty > 0;

                            return (
                              <div
                                key={price._id}
                                className="bg-[#beeccd] hover:bg-[#629584] p-2 rounded-md hover:text-white text-gray-900 text-sm cursor-pointer h-24"
                                onClick={() => addToOrder(price)}
                              >
                                {showStockQty && (
                                  <p className="text-center font-bold text-xs text-white mb-1 
                                bg-[#629584] rounded-md p-1">
                                    <i>
                                      {stockQtyBottles} Bottles{" "}
                                      {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                    </i>
                                  </p>
                                )}
                                <p className="text-center font-bold mt-1">
                                  <i>{selectedBrandMenuItem.name}</i>
                                </p>
                                <p className="text-center font-extrabold ">
                                  {price.barCategory}
                                </p>
                                {/* Render the price dynamically */}
                                <p className="text-center font-semibold ">
                                  ₹{price.price}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className=" lg:w-[35.70%] w-full md:w-[40.70%] lg:-ml-1 md:ml-0 ml-3  bg-[#E2F1E7] -mt-3  relative  ">
              <div
                className="md:hidden cursor-pointer mr-1 absolute top-2 right-0 mb-2 rounded-md"
                onClick={handleToggle}
              >
                <svg viewBox="0 0 10 8" width="20">
                  <path
                    d="M1 1h8M1 4h 8M1 7h8"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* 
                
                   <div className=" lg:flex">
                <div className="font-bold text-sm px-3 flex mt-2 mb-1 whitespace-nowrap">
                  <div className="mt-1">Last Bills</div>
                  <div className="mt-1 mb-1 lg:ml-2 float-right">
                    <input
                      type="text"
                      placeholder="Search Bill No..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="p-1 rounded-lg ml-1 px-0.5 w-20 -mt-1 sm:w-32 md:w-15 lg:w-28 pl-2 font-medium"
                    />
                  </div>
                 
                </div>
              </div>
                
    <div className="flex flex-row items-center justify-between lg:px-2">
                <div className="font-semibold text-sm custom-scrollbars overflow-x-auto lg:w-full md:w-96 sm:w-80">
                  <div className="flex flex-row mb-1 cursor-pointer">
                    {filteredOrders
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((order) => (
                        <div
                          key={order._id}
                          className="flex-shrink-0 mr-3 p-1 bg-white rounded-lg shadow-md hover:shadow-lg"
                          onClick={() => handleOrderClick(order)}
                        >
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-[#E2F1E7] px-4">
                              <span className="font-semibold text-sm text-[#387478]">
                                {order.orderNumber.replace(/\D/g, "")}
                              </span>
                            </div>
                            {/* <span className="font-semibold text-xs">
                            ₹{Math.round(order.grandTotal?.toFixed(2))}
                          </span> 
                          <span className="font-semibold text-xs mt-1">
                          ₹
                          {Math.round(
                            order.grandTotal?.toFixed(2) -
                              (order.discount || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

                */}

              {tableInfo ? (
                <div>
                  <div className=" lg:text-xl md:text-md text-xs lg:px-5 md:px-3 px-1  text-[#387478]  font-medium mt-1  flex flex-col md:flex-row lg:flex-row  justify-between">
                    <p>{tableInfo ? ` ${tableInfo.section.name}` : " "}</p>
                    <p className=" ">
                      {tableInfo ? ` Table # ${tableInfo.tableName}` : " "}
                    </p>

                    <select
                      name="waiterName"
                      value={waiterName}
                      onChange={handleInputChange}
                      className="mt-1 p-1 border rounded-md text-xs text-gray-600  cursor-pointer"
                      required
                    >
                      <option value="" disabled>
                        Select Waiter
                      </option>
                      {waitersList.map((waiter) => (
                        <option key={waiter._id} value={waiter.waiterName}>
                          {waiter.waiterName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <!-- end header --> */}
                  {/* <!-- order list --> */}
                  {/* <div className="p-1 custom-scrollbars overflow-y-auto h-52 lg:h-64 md:h-40  max-h-[calc(80vh-1rem)] lg:text-sm md:text-sm text-xs lg:pl-10"> */}
                  <div
                    className="p-1 custom-scrollbars overflow-y-auto h-96 lg:h-96 md:h-96 max-h-[calc(80vh-1rem)] lg:text-sm md:text-sm text-xs lg:pl-2 pl-2"
                    style={{
                      scrollbarWidth: "auto",
                      scrollbarColor: "#6b7280 #e5e7eb",
                    }}
                  >
                    {currentOrder.map((orderItem) => (
                      <div
                        key={orderItem._id}
                        className="flex items-center mb-2 "
                      >
                        <input
                          type="checkbox"
                          id={`checkbox_${orderItem.name}`}
                          name={`checkbox_${orderItem.name}`}
                          className="mr-2 cursor-pointer"
                          checked={selectedMenuNames.includes(orderItem.name)}
                          onChange={() => handleCheckboxChange(orderItem.name)}
                        />

                        <div className="flex flex-row items-center ">
                          <div className="flex items-center h-full">
                            <span className="font-semibold lg:w-48 md:w-44 w-20 sm:text-xs md:text-xs lg:text-base lg:ml-1 md:-ml-1 text-xs ">
                              {orderItem.name}
                            </span>
                          </div>
                        </div>
                        <div className="lg:mr-3 md:mr-3 mr-1">
                          <input
                            type="number"
                            min="1"
                            max={orderItem.quantity}
                            value={quantitiesToCancel[orderItem.name] || ""}
                            onChange={(e) =>
                              handleQuantityChanged(
                                orderItem.name,
                                e.target.value
                              )
                            }
                            className="border rounded-md  px-2 py-1 w-16 text-center mt-1"
                            placeholder="Qty"
                          />
                        </div>

                        <div className="flex md:flex-row items-center lg:text-sm md:text-sm text-xs sm:flex">
                          {/* Use input element with datalist */}
                          <input
                            id={`tasteSelect_${orderItem._id}`}
                            name={`tasteSelect_${orderItem._id}`}
                            placeholder="Add Taste "
                            list={`tasteDatalist_${orderItem._id}`}
                            value={selectedTastes[orderItem._id] || ""}
                            onChange={(e) =>
                              handleSelectChange(orderItem._id, e.target.value)
                            }
                            className="cursor-pointer mt-1 p-1 lg:-ml-3  lg:w-32 w-20  md:-ml-1 sm:ml-0 align-middle  text-center border-2 rounded-md text-xs  text-gray-500 lg:text-sm md:text-xs ml-2 "
                            required
                          />

                          {/* Datalist containing the options for tastes */}
                          <datalist id={`tasteDatalist_${orderItem._id}`}>
                            {/* Add a default option */}
                            <option value="" disabled>
                              Select taste
                            </option>
                            {tastes.map((taste) => (
                              <option key={taste._id} value={taste.taste}>
                                {taste.taste}
                              </option>
                            ))}
                            {/* Add an option for "Other" */}
                            {/* <option value="other">Other</option> */}
                          </datalist>

                          {/* Display input field when "Other" is selected */}
                          {selectedTastes[orderItem._id] === "other" && (
                            <input
                              type="text"
                              value={newTastes[orderItem._id] || ""}
                              onChange={(e) =>
                                handleNewTasteChange(
                                  orderItem._id,
                                  e.target.value
                                )
                              }
                              placeholder="Enter new taste"
                              className="mt-1 p-1 border rounded-md text-sm lg:w-22   text-gray-500"
                              required
                            />
                          )}

                          <div className="float-right flex justify-between md:ml-1 mt-2">
                            <span
                              className="rounded-md cursor-pointer items-center  align-middle text-center  
                         font-bold p-1 lg:w-4 lg:text-md md:w-4 sm:w-4 ml-2 lg:-mt-0.5"
                              onClick={() => removeFromOrder(orderItem)}
                            >
                              <FontAwesomeIcon
                                icon={faCircleMinus}
                                size="lg"
                                style={{ color: "red" }}
                              />
                            </span>
                            <input
                              type="number"
                              value={orderItem.quantity}
                              onChange={(e) =>
                                handleQuantityChange(e, orderItem)
                              }
                              className="font-semibold lg:w-10  w-10 justify-center flex text-center rounded-md align-center ml-3 mr-3 md:text-xs pl-0 curs"
                              min={1}
                            />
                            <span
                              className="rounded-md cursor-pointer sm:w-2 lg:w-6 justify-center flex align-middle text-center md:w-4 font-bold p-1 sm:p-0 lg:text-md   items-center lg:pr-5"
                              onClick={() => addToOrder(orderItem)}
                            >
                              <FontAwesomeIcon
                                icon={faCirclePlus}
                                size="lg"
                                style={{ color: "red" }}
                              />
                            </span>
                          </div>
                        </div>
                        {/* <div className="font-semibold  lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-2 ml-1 lg:mt-2  md:mt-0 sm:mt-0 sm:text-xs sm:w-10 lg:mr-1 md:mr-2 ">
                          {`₹${(orderItem[`pricePer${orderItem.barCategory}`] * orderItem.quantity)}`}
                      </div> */}
                        {/* <div className="font-semibold lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-2 ml-1 lg:mt-2 md:mt-0 sm:mt-0 sm:text-xs sm:w-10 lg:mr-1 md:mr-2 ">
                        {orderItem.price ?
                          `₹${(orderItem.price * orderItem.quantity)}` :
                          (orderItem.pricePer[`pricePer${orderItem.barCategory}`] ?
                            `₹${(orderItem.pricePer[`pricePer${orderItem.barCategory}`] * orderItem.quantity)}` :
                            "Price not available"
                          )
                        }
                      </div> */}
                        <div className="font-semibold lg:text-base md:text-md text-xs mt-1 text-right lg:-ml-2 ml-1 lg:mt-2 md:mt-2 sm:mt-0 sm:text-xs sm:w-10 lg:mr-1 md:mr-2">
                          {orderItem.price
                            ? `₹${orderItem.price * orderItem.quantity}`
                            : orderItem.pricePer?.[
                                `pricePer${orderItem.barCategory}`
                              ]
                            ? `₹${
                                orderItem.pricePer[
                                  `pricePer${orderItem.barCategory}`
                                ] * orderItem.quantity
                              }`
                            : "Price not available"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* <!-- end order list --> */}
                  {/* <!-- totalItems --> */}
                  <div className="px-5 lg:mt-2 mt-2 lg:ml-0 md:-ml-1 ml-0 lg:text-sm md:text-sm text-xs sm:ml-2">
                    <div className="py-1 rounded-md shadow-md bg-white  ">
                      <div className="px-4 flex justify-between ">
                        <span className="font-semibold text-xs lg:text-sm">
                          Menu Subtotal
                        </span>
                        <span className="font-semibold text-xs lg:text-sm">
                          ₹{calculateTotal().subtotal}
                        </span>
                      </div>

                      <div className="px-4 flex justify-between ">
                        <span className="font-semibold text-xs lg:text-sm">
                          Liquor Subtotal
                        </span>
                        <span className="font-semibold text-xs lg:text-sm">
                          ₹{calculateTotal().barSubtotal}
                        </span>
                      </div>

                      {acPercentage > 0 && (
                        <div className="px-4 flex justify-between ">
                          <span className="font-bold text-xs lg:text-sm">
                            AC
                          </span>
                          <span className="font-bold"></span>
                          <span className="font-bold text-xs lg:text-sm">
                            ( {acPercentage}% ) ₹
                            {calculateTotal().acPercentageAmount}
                          </span>
                        </div>
                      )}

                      {isGSTEnabled && gstPercentage > 0 && (
                        <div>
                          <div className="px-4 flex justify-between ">
                            <span className="font-bold text-xs lg:text-sm">
                              CGST
                            </span>
                            <span className="font-bold">
                              ({gstPercentage / 2}%) ₹{calculateTotal().CGST}
                            </span>
                          </div>
                          <div className="px-4 flex justify-between ">
                            <span className="font-bold text-xs lg:text-sm">
                              SGST
                            </span>

                            <span className="font-bold">
                              ({gstPercentage / 2}%) ₹{calculateTotal().SGST}
                            </span>
                          </div>
                        </div>
                      )}

                      {isVATEnabled && vatPercentage > 0 && (
                        <div>
                          <div className="px-4 flex justify-between ">
                            <span className="font-bold text-xs lg:text-sm">
                              VAT
                            </span>
                            <span className="font-bold">
                              ({vatPercentage}%) ₹{calculateTotal().VAT}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="border-t-2 lg:py-1 lg:px-4 py-1 px-1 flex items-center justify-between ">
                        <span className=" font-bold text-sm lg:text-2xl -mt-1 lg:-mt-1 md:ml-2 lg:ml-0 ml-2">
                          Total
                        </span>
                        <span className="font-semibold text-sm lg:text-2xl lg:mr-0 md:mr-2 lg:-mt-1 -mt-1 mr-3">
                          {/* ₹{(calculateTotal().total)} */}₹
                          {Math.round(calculateTotal().grandTotal) || 0}
                        </span>
                        {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                      </div>
                      <div className="px-5 text-left text-xs lg:text-sm text-gray-600 font-sans font-bold lg:ml-0 -ml-2 -mt-1 lg:mt-0 ">
                        Total Items: {calculateTotal().totalQuantity}
                      </div>
                    </div>
                  </div>
                  {/* <!-- end total --> */}

                  {/* <!-- button pay--> */}
                  {/* <!-- button pay--> */}
                  <div className="w-full lg:ml-0">
                    <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 mt-5 gap-2 pl-2 pr-2">
                      {!isLanState && (
                        <div className="w-auto mb-0 lg:mb-1 sm:mr-2">
                          <div
                            className="px-3 py-1.5 lg:py-2 text-center rounded-md bg-blue-700 hover:bg-blue-600 text-white font-bold cursor-pointer text-xs"
                            onClick={saveBill}
                          >
                            {/* KOT / BOT ( / ) */}
                            {userRole === "adminBar"
                              ? "KOT / BOT ( / )"
                              : "KOT ( / )"}
                          </div>
                        </div>
                      )}

                      {isLanState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer text-xs"
                            onClick={saveBillLan}
                          >
                            {/* KOT / BOT ( / ) */}
                            {userRole === "adminBar"
                              ? "KOT / BOT ( / )"
                              : "KOT ( / )"}
                          </div>
                        </div>
                      )}

                      {!isLanState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1  sm:mr-2">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-yellow-600 hover:bg-red-500 text-white font-bold cursor-pointer text-xs"
                            onClick={saveKot}
                          >
                            Re-KOT ( . )
                          </div>
                        </div>
                      )}

                      {isLanState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1  sm:mr-2">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer text-xs"
                            onClick={saveKotLan}
                          >
                            Re-KOT ( . )
                          </div>
                        </div>
                      )}

                      {userRole === "adminBar" && (
                        <div className=" sm:w-auto mb-0 lg:mb-1  sm:mr-2">
                          {!isLanState && (
                            <div
                              className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer text-xs"
                              onClick={saveBot}
                            >
                              Re-BOT
                            </div>
                          )}
                          {isLanState && (
                            <div
                              className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer text-xs"
                              onClick={saveBotLan}
                            >
                              Re-BOT
                            </div>
                          )}
                        </div>
                      )}

                      <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                        <div
                          className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer text-xs"
                          onClick={WaitingBill}
                        >
                          Wait (Home)
                        </div>
                      </div>

                      <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                        <div
                          className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-violet-800 hover:bg-violet-700 text-white font-bold cursor-pointer text-xs"
                          onClick={handleSave}
                        >
                          Save-Bill (PgUp)
                        </div>
                      </div>

                      {!isLanBillState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-pink-600 hover:bg-orange-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handlePrintBill}
                          >
                            Print-Bill( * )
                          </div>
                        </div>
                      )}

                      {isLanBillState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handlePrintBillLan}
                          >
                            Print-Bill( * )
                          </div>
                        </div>
                      )}

                      {isDirectState && !isLanBillState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handleCashBill}
                          >
                            Cash
                          </div>
                        </div>
                      )}
                      {isDirectState && isLanBillState && (
                        <div className="sm:w-auto mb-0 lg:mb-1 sm:mr-2">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handleCashBillLan}
                          >
                            Cash
                          </div>
                        </div>
                      )}
                      {isDirectState && !isLanBillState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handleOnlineBill}
                          >
                            Online
                          </div>
                        </div>
                      )}

                      {isDirectState && isLanBillState && (
                        <div className="sm:w-auto mb-0 lg:mb-1 sm:mr-2">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handleOnlineBillLan}
                          >
                            Online
                          </div>
                        </div>
                      )}
                      {!isLanState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-1 py-1.5 lg:py-2 rounded-md text-center bg-gray-500 hover:bg-gray-400 text-white font-bold cursor-pointer text-xs"
                            onClick={handleCancelKOT}
                          >
                            {userRole === "adminBar"
                              ? "Cancel KOT / BOT"
                              : "Cancel KOT"}
                          </div>
                        </div>
                      )}

                      {isLanState && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-gray-600 hover:bg-gray-500 text-white font-bold cursor-pointer text-xs"
                            onClick={handleCancelKOTLan}
                          >
                            {/* Cancel KOT / BOT */}
                            {userRole === "adminBar"
                              ? "Cancel KOT / BOT"
                              : "Cancel KOT"}
                          </div>
                        </div>
                      )}

                      <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                        <div
                          className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer text-xs"
                          onClick={showTables}
                        >
                          Tables
                        </div>
                      </div>

                      {userRole !== "adminBar" && (
                        <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                          <div
                            className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-orange-900 hover:bg-orange-800 text-white font-bold cursor-pointer text-xs"
                            onClick={home}
                          >
                            Exit
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="font-extrabold justify-between ml-10 lg:text-base text-sm md:text-base  mt-40 flex sm:text-xs whitespace-nowrap">
                  Please Select a Table to Bill !
                </div>
              )}

              {isCloseTablesModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50 "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="bg-white border rounded p-5 shadow-md z-50 absolute">
                    <p className="text-gray-700 font-semibold text-center text-xl">
                      <p>Are you sure you want to close the table?</p>
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
                        onClick={() => handleConfirmCloseTables()}
                      >
                        Yes
                      </button>
                      <button
                        className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                        onClick={() => handleCloseTablesModal()}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isRestoreModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div
                    className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                      onClick={() => setIsRestoreModalOpen(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <div className="p-1 text-sm md:text-base">
                      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                        Restore MainTable
                      </h3>
                      {/* Add section name field */}

                      <div className="mb-4">
                        <label
                          htmlFor="sectionName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Section Name
                        </label>
                        <select
                          id="sectionName"
                          name="sectionName"
                          value={sectionName}
                          onChange={(e) => setSectionName(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {displaySectionsForSelectionSplit}
                        </select>
                      </div>

                      {/* <div className="mb-4">
                      <label htmlFor="sectionName" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Section Name
                      </label>
                      <input
                        type="text"
                        id="sectionName"
                        name="sectionName"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div> */}
                      <div className="mb-4">
                        <label
                          htmlFor="mainTableName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Main TableName / TableNumber
                        </label>
                        <input
                          type="text"
                          id="mainTableName"
                          name="mainTableName"
                          value={mainTableName}
                          onChange={(e) => setMainTableName(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="text-center text-sm md:text-base">
                        <button
                          type="button"
                          className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                          onClick={() =>
                            handleResetTable(sectionName, mainTableName)
                          } // Pass the sectionName and mainTableName to the reset function
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isShowModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div
                    className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                      onClick={() => setIsShowModalOpen(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <div className="p-1 text-sm md:text-base">
                      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                        Split Table
                      </h3>
                      <div className="mb-4">
                        <label
                          htmlFor="mainTableName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Main TableName / TableNumber
                        </label>
                        <input
                          type="text"
                          id="mainTableName"
                          name="mainTableName"
                          value={mainTableName}
                          onChange={(e) => setMainTableName(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="numberOfSubtablesToShow"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Number of Splits
                        </label>
                        <input
                          type="number"
                          id="numberOfSubtablesToShow"
                          name="numberOfSubtablesToShow"
                          value={numberOfSubtablesToShow}
                          onChange={(e) =>
                            setNumberOfSubtablesToShow(e.target.value)
                          }
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                          min={0}
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="sectionName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Section Name
                        </label>
                        <select
                          id="sectionName"
                          name="sectionName"
                          value={sectionName}
                          onChange={(e) => setSectionName(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {displaySectionsForSelectionSplit}
                        </select>
                      </div>
                      <div className="text-center text-sm md:text-base">
                        <button
                          type="button"
                          className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                          onClick={() =>
                            handleShowSubmit(
                              sectionName,
                              mainTableName,
                              numberOfSubtablesToShow
                            )
                          } // Pass arguments to handleShowSubmit
                        >
                          Split
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isNewModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div
                    className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                      onClick={() => setIsNewModalOpen(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <div className="p-1 text-sm md:text-base">
                      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                        Merge Tables
                      </h3>
                      <div className="mb-4">
                        <label
                          htmlFor="destinationTableId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          To Table
                        </label>
                        <input
                          type="text"
                          id="destinationTableId"
                          name="destinationTableId"
                          value={destinationTableId}
                          onChange={(e) =>
                            setDestinationTableId(e.target.value)
                          }
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="sourceTableId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          From Table
                        </label>
                        <input
                          type="text"
                          id="sourceTableId"
                          name="sourceTableId"
                          value={sourceTableId}
                          onChange={(e) => setSourceTableId(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="sectionSelection"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Section Name
                        </label>
                        <select
                          id="sectionSelection"
                          name="sectionSelection"
                          value={sectionId}
                          onChange={(e) => setSectionId(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {displaySectionsForSelection}
                        </select>
                      </div>
                      <div className="text-center text-sm md:text-base">
                        <button
                          type="button"
                          className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                          onClick={() =>
                            handleMergeTables(
                              sectionId,
                              destinationTableId,
                              sourceTableId
                            )
                          }
                        >
                          Merge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isErrorModalOpenMerge && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div
                    className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                      onClick={() => setIsErrorModalOpenMerge(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <div className="p-1 text-sm md:text-base">
                      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                        Prohibited !
                      </h3>
                      <div className="text-red-600 text-center mb-4 font-semibold">
                        {errorMessageMerge}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isShiftModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-10"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div
                    className="modal-container bg-white w-full md:w-96 p-6 m-4 rounded shadow-lg text-sm md:text-base"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="bg-red-100 text-red-600 p-1 px-2 hover:bg-red-200 rounded-full text-center float-right"
                      onClick={() => setIsShiftModalOpen(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <div className="p-1 text-sm md:text-base">
                      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400 text-center">
                        Shift Table
                      </h3>

                      {/* Source Section Dropdown */}
                      <div className="mb-4">
                        <label
                          htmlFor="sourceSectionSelection"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          From Section
                        </label>
                        <select
                          id="sourceSectionSelection"
                          name="sourceSectionSelection"
                          value={sourceSectionId}
                          onChange={(e) => setSourceSectionId(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {displaySectionsForSelection}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="sourceTableId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          From Table
                        </label>
                        <input
                          type="text"
                          id="sourceTableId"
                          name="sourceTableId"
                          value={sourceTableId}
                          onChange={(e) => setSourceTableId(e.target.value)}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Destination Section Dropdown */}
                      <div className="mb-4">
                        <label
                          htmlFor="destinationSectionSelection"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          To Section
                        </label>
                        <select
                          id="destinationSectionSelection"
                          name="destinationSectionSelection"
                          value={destinationSectionId}
                          onChange={(e) =>
                            setDestinationSectionId(e.target.value)
                          }
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {displaySectionsForSelection}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="destinationTableId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          To Table
                        </label>
                        <input
                          type="text"
                          id="destinationTableId"
                          name="destinationTableId"
                          value={destinationTableId}
                          onChange={(e) =>
                            setDestinationTableId(e.target.value)
                          }
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="text-center text-sm md:text-base">
                        <button
                          type="button"
                          className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mx-auto mt-4"
                          onClick={() =>
                            handleShiftTables(
                              sourceSectionId,
                              sourceTableId,
                              destinationSectionId,
                              destinationTableId
                            )
                          }
                        >
                          Shift
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isPaymentModalOpen && (
                <PaymentModal
                  onClose={() => setIsPaymentModalOpen(false)}
                  tableName={
                    tableInfo ? tableInfo.tableName : "Table Not Found"
                  }
                  totalAmount={calculateTotal().total}
                  tableId={tableId}
                />
              )}
            </div>
            {/* Mpbile View */}
            {isMobile && (
              <div className=" absolute left-0 top-0 w-72 mt-8 z-50 bg-white rounded-md">
                <div className="pt-4">
                  <Try />
                </div>
                <div className=" grid gap-1 grid-cols-2 lg:grid-cols-4   md:grid-cols-4 text-left ml-4  mt-1 lg:mt-2 mb-3">
                  <button
                    className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400 "
                    onClick={() => setIsNewModalOpen(true)}
                  >
                    <FontAwesomeIcon
                      icon={faDownLeftAndUpRightToCenter}
                      className="mr-2"
                    />
                    Merge
                  </button>

                  <button
                    className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                    onClick={() => setIsShowModalOpen(true)}
                  >
                    <FontAwesomeIcon
                      icon={faArrowsSplitUpAndLeft}
                      className="mr-2"
                    />
                    Split
                  </button>

                  <button
                    className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                    onClick={() => setIsRestoreModalOpen(true)}
                  >
                    <FontAwesomeIcon
                      icon={faDiagramPredecessor}
                      className="mr-2"
                    />
                    UnSplit
                  </button>
                  <button
                    className="text-violet-700 hover:bg-violet-200 font-bold rounded-md text-xs md:text-xs bg-slate-100 mr-2 p-1 h-7 shadow-inner border-2 border-indigo-400"
                    onClick={() => setIsShiftModalOpen(true)}
                  >
                    <FontAwesomeIcon icon={faDiagramNext} className="mr-2" />
                    Shift
                  </button>
                </div>

                <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
                  <span
                    key="all-items"
                    className={`cursor-pointer px-2  py-1 mb-1 hover:text-[#ffffff] hover:bg-[#387478] rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                      selectedCategory === null
                         ? "bg-[#629584] text-white"

                        : ""
                    }`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    All Menu
                  </span>
                  {categories.map((category) => (
                    <span
                      key={category._id}
                      className={`whitespace-nowrap cursor-pointer bg-[#E2F1E7] hover:bg-[#387478] hover:text-[#ffffff]  px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                        selectedCategory === category
                          ? "bg-[#387478] text-white"

                          : ""
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap mt-1">
                  <span
                    key="all-items"
                    className={`cursor-pointer hover:text-[#ffffff] hover:bg-[#387478] px-2 py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                      selectedBarCategory === null
                       ? "bg-[#629584] text-white"


                        : ""
                    } ${!tableId ? "cursor-not-allowed opacity-50" : ""}`} // Disabled styling
                    onClick={
                      tableId ? () => handleBarCategoryClick(null) : null
                    } // Conditional onClick handler
                  >
                    All Bar Menu
                  </span>

                  {barCategories.map((category) => (
                    <span
                      key={category._id}
                      className={`whitespace-nowrap cursor-pointer bg-[#E2F1E7] hover:bg-[#387478] hover:text-[#ffffff]   px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                        selectedBarCategory === category
                         ? "bg-[#387478]  text-white"

                          : ""
                      }`}
                      onClick={() => handleBarCategoryClick(category)}
                    >
                      {category.liquorCategory}
                    </span>
                  ))}
                </div>
                <div className=" flex justify-start px-5 ml-1 mt-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search Menu / Id..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchInputKeyDown}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-18 lg:w-48 md:w-44
               text-xs -ml-4 lg:ml-0 md:ml-0 lg:text-sm md:text-sm"
                  />
                </div>

                {showCategoryMenus && (
                  <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(67vh-1rem)] md:max-h-[calc(55vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                    {(menus.menus || menus)
                      .filter(filterMenus) // Apply the filterMenus function
                      .map((product, index) => (
                        <div
                          key={product._id}
                          className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20 cursor-pointer"
                          onClick={() => addToOrder(product)}
                          tabIndex={0}
                          ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                          onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                        >
                          <div>
                            <div className="lg:-mt-3 ">
                              <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap ">
                                {product.uniqueId}
                              </span>
                              <span
                                className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap "
                                style={{ fontSize: "12px" }}
                              >
                                ₹{product.price}
                              </span>
                            </div>

                            <div className="justify-center flex">
                              <img
                                src={
                                  product.imageUrl
                                    ? `http://localhost:5000/${product.imageUrl}`
                                    : `/tray.png`
                                }
                                className={`object-cover rounded-md ${
                                  product.imageUrl
                                    ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                    : "lg:w-12 lg:h-10 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4 "
                                } hidden lg:block `}
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                            <span
                              className="md:text-xs sm:text-xs lg:mb-1 flex"
                              style={{ fontSize: "12px" }}
                            >
                              <i>{product.name}</i>
                            </span>
                            <span>
                              {product.stockQty > 0 && (
                                <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                  Q: {product.stockQty}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {showBarCategoryMenus && showBarMenus && (
                  <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                    {(
                      barMenus &&
                      (Array.isArray(barMenus) ? barMenus : barMenus.barMenus)
                    )
                      ?.filter(filterMenus)
                      .map((product, index) => (
                        <div
                          key={product._id}
                          className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-sm lg:h-32 md:h-20"
                          tabIndex={0}
                          onClick={() => handleClickBarMenuItem(product)}
                        >
                          <div>
                            <div className="lg:-mt-3">
                              <span className="text-orange-500 md:text-xs text-xs font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                                {/* {product.uniqueId} */}
                              </span>
                              <span
                                className="float-right text-green-700 text-xs md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                                style={{ fontSize: "12px" }}
                              >
                                {/* ₹{product.pricePer1Bottle} */}
                              </span>
                            </div>
                            <div className="justify-center flex">
                              <img
                                src={
                                  product.imageUrl
                                    ? `http://localhost:5000/${product.imageUrl}`
                                    : `/wine.jpg`
                                }
                                className={`object-cover rounded-md ${
                                  product.imageUrl
                                    ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                    : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4"
                                } hidden lg:block`}
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                            <span
                              className="md:text-xs sm:text-xs lg:mb-1 flex font-bold"
                              style={{ fontSize: "12px" }}
                            >
                              <i>{product.name}</i>
                            </span>
                            <span>
                              {product.stockQty > 0 && (
                                <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                  Q: {product.stockQty}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {selectedBarMenuItem && (
                  <>
                    <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] ">
                      {/* Render prices grid here */}

                      <div className="mb-2 ml-5 flex">
                        <p className="text-left font-bold mt-">
                          Choose Bottle to Sell / Pour
                        </p>
                        <select
                          className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer ml-4"
                          onChange={handleParentMenuSelect} // Event handler for capturing the selected childMenuId
                        >
                          <option value="">
                            Select Bottle to Sell / Pour{" "}
                          </option>
                          {selectedBarMenuItem.childMenus
                            .filter(
                              (childMenu) =>
                                parseInt(
                                  childMenu.barCategory.replace("ml", "")
                                ) >= 90 &&
                                Object.values(childMenu.pricePer).some(
                                  (price) => price > 1
                                )
                            ) // Filter based on barCategory > 90ml
                            .map((childMenu) => (
                              <option
                                key={childMenu._id}
                                value={childMenu.name}
                              >
                                {childMenu.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {selectedOptionForBar && (
                        <div
                          className="grid grid-cols-2 gap-2 p-2"
                          key={selectedBarMenuItem._id}
                        >
                          {/* Render child menu prices */}
                          {selectedBarMenuItem.childMenus.map((childMenu) => {
                            if (
                              childMenu.barCategory &&
                              childMenu.pricePer[
                                `pricePer${childMenu.barCategory}`
                              ] > 0
                            ) {
                              // Check if stockQtyStr exists and is not undefined
                              const stockQtyStr = childMenu.stockQtyStr
                                ? childMenu.stockQtyStr
                                : "0";

                              // Split the stockQtyStr into bottles and ml
                              const [stockQtyBottles, stockQtyMl] =
                                stockQtyStr.split(".");

                              // Check if stockQtyBottles is greater than 0
                              const stockQty = parseInt(stockQtyBottles);
                              const showStockQty = stockQty > 0;

                              return (
                                <div
                                  key={childMenu._id}
                                  className="bg-[#beeccd] hover:bg-[#629584] p-2 rounded-md hover:text-white text-gray-900 cursor-pointer"
                                  onClick={() => addToOrder(childMenu)}
                                >
                                  {showStockQty && (
                                    <p className="text-center font-bold text-xs text-white mb-1 
                                bg-[#629584] rounded-md">
                                      <i>
                                        {stockQtyBottles} Bottles{" "}
                                        {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                      </i>
                                    </p>
                                  )}
                                  <p className="text-center font-bold">
                                    <i>{selectedBarMenuItem.name}</i>
                                  </p>
                                  <p className="text-center font-semibold ">
                                    {childMenu.barCategory}
                                  </p>
                                  {/* Render the price dynamically */}
                                  <p className="text-center font-semibold">
                                    ₹
                                    {
                                      childMenu.pricePer[
                                        `pricePer${childMenu.barCategory}`
                                      ]
                                    }
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {showBrandCategoryMenus && (
                  <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-2 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                    {selectedBarCategory &&
                      barMenus.brands?.map((product, index) => (
                        <div
                          key={product._id}
                          className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md justify-between text-base lg:h-32 md:h-20"
                          onClick={() => handleClickBrandMenuItem(product)}
                          tabIndex={0}
                          ref={(el) => (menuItemRefs.current[index] = el)}
                          onKeyDown={(e) => handleMenuItemKeyDown(e, product)}
                        >
                          <div>
                            <div className="lg:-mt-3">
                              <span className="text-orange-500 md:text-xs text-sm font-semibold lg:text-sm rounded-md overflow-hidden whitespace-nowrap">
                                {product.uniqueId}
                              </span>
                              <span
                                className="float-right text-green-700 text-sm md:text-xs font-bold lg:text-sm rounded-md overflow-hidden whitespace-nowrap"
                                style={{ fontSize: "12px" }}
                              >
                                {product.price}
                              </span>
                            </div>
                            <div className="justify-center flex">
                              <img
                                src={
                                  product.imageUrl
                                    ? `http://localhost:5000/${product.imageUrl}`
                                    : `/wine.jpg`
                                }
                                className={`object-cover rounded-md ${
                                  product.imageUrl
                                    ? "lg:w-24 lg:h-16 md:w-14 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:mt-1"
                                    : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-4 md:mt-4"
                                } hidden lg:block`}
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex justify-between">
                            <span
                              className="md:text-sm sm:text-xs lg:mb-1 flex"
                              style={{ fontSize: "12px" }}
                            >
                              <i>{product.name}</i>
                            </span>
                            <span>
                              {product.stockQty > 0 && (
                                <span className="text-xs px-2 font-bold text-white mt-1 shadow-md bg-orange-500 rounded-full">
                                  Q: {product.stockQty}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {selectedBrandMenuItem && showBrandMenus && (
                  <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] cursor-pointer">
                    <div className="mb-2 ml-5">
                      <p className="text-left font-bold">
                        Choose Bottle to Sell / Pour
                      </p>
                      <select
                        className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                        onChange={handleParentMenuSelect} // Event handler for capturing the selected parentMenuId
                      >
                        <option value="">Select Bottle to Sell / Pour</option>

                        {selectedBrandMenuItem.prices
                          .filter(
                            (price) =>
                              price.price > 0 &&
                              price.barCategory.endsWith("ml") &&
                              parseFloat(price.barCategory) >= 90
                          )
                          .map((price) => (
                            <option key={price._id} value={price.name}>
                              {" "}
                              {/* Assuming price.parentMenuId contains the parentMenuId */}
                              {price.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {selectedOptionForBar && (
                      <div
                        className="grid grid-cols-2 gap-2 p-1"
                        key={selectedBrandMenuItem?._id}
                      >
                        {/* Render child menu prices */}
                        {selectedBrandMenuItem?.prices &&
                          selectedBrandMenuItem.prices.map((price) => {
                            if (price && price.price > 0) {
                              // Check if stockQtyStr exists and is not undefined
                              const stockQtyStr = price.stockQtyStr || "0";

                              // Split the stockQtyStr into bottles and ml
                              const [stockQtyBottles, stockQtyMl] =
                                stockQtyStr.split(".");

                              // Check if stockQtyBottles is greater than 0
                              const stockQty = parseInt(stockQtyBottles);
                              const showStockQty = stockQty > 0;

                              return (
                                <div
                                  key={price._id}
                                  className="bg-[#beeccd] hover:bg-[#629584] p-2 rounded-md hover:text-white text-gray-900 text-sm cursor-pointer"
                                  onClick={() => addToOrder(price)}
                                >
                                  {showStockQty && (
                                    <p className="text-center font-bold text-xs text-white mb-1 
                                bg-[#629584] rounded-md">
                                      <i>
                                        {stockQtyBottles} Bottles{" "}
                                        {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                      </i>
                                    </p>
                                  )}
                                  <p className="text-center font-bold">
                                    <i>{selectedBrandMenuItem.name}</i>
                                  </p>
                                  <p className="text-center font-extrabold text-white">
                                    {price.barCategory}
                                  </p>
                                  {/* Render the price dynamically */}
                                  <p className="text-center font-semibold text-red-900">
                                    ₹{price.price}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}{" "}
            {/* <!-- Right section --> */}
          </div>
          {/* <!-- end products --> */}
        </div>
      </div>
    </>
  );
};

export default Billing;
