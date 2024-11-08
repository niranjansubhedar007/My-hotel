"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleMinus,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import EditPaymentModal from "@/app/editPayment/page";

const calculateUpdatedACPercentageAmount = (
  isACEnabled,
  acPercentageAmount,
  acPercentage,
  currentOrder,
  sectionACPercentage
) => {
  if (
    isACEnabled &&
    (!acPercentageAmount || acPercentageAmount === 0) &&
    currentOrder
  ) {
    const acPercentageDecimal = sectionACPercentage / 100;
    return calculateTotal(currentOrder).subtotal * acPercentageDecimal;
  } else {
    return acPercentageAmount;
  }
};

const EditOrderPage = ({ params, tableId }) => {
  const { orderNumber } = params;
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null);
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [order, setOrder] = useState(null);
  const [acPercentage, setACPercentage] = useState(0);
  const [acPercentageAmount, setACPercentageAmount] = useState(0);
  const [tableInfo, setTableInfo] = useState({ tableName: "", totalAmount: 0 });
  const menuItemRefs = useRef([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDirectState, setIsDirectState] = useState([]); // State to store isDirect values
  const [isLanState, setIsLanState] = useState(null);
  const [isLanBillState, setIsLanBillState] = useState(null); // New state for lanBill
  const [selectedBarCategory, setSelectedBarCategory] = useState(null);
  const [barCategories, setBarCategories] = useState([]);
  const [showCategoryMenus, setShowCategoryMenus] = useState(true);
  const [showBarCategoryMenus, setShowBarCategoryMenus] = useState(true);
  const [showBarMenus, setShowBarMenus] = useState(true);
  const [selectedBarMenuItem, setSelectedBarMenuItem] = useState(null);
  const [showBrandMenus, setShowBrandMenus] = useState(true);
  const [showBrandCategoryMenus, setShowBrandCategoryMenus] = useState(true);
  const [barMenus, setBarMenus] = useState([]);
  const [selectedBrandMenuItem, setSelectedBrandMenuItem] = useState(null);
  const [isVATEnabled, setIsVATEnabled] = useState(true); // State for enabling/disabling GST
  const [vatPercentage, setVATPercentage] = useState(0); // Add this line for the GST percentage
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOptionForBar, setSelectedOptionForBar] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const [items, setItems] = useState(null);


  // const handleParentMenuSelect = (event) => {
  //   const selectedParentId = event.target.value;
  //   // Update state or variable holding the selectedParentId
  //   console.log(selectedParentId);
  //   setSelectedParentId(selectedParentId);
  //   setSelectedOptionForBar(event.target.value)
  // };

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

  useEffect(() => {
    setSelectedOptionForBar(null);
  }, [selectedBarMenuItem, selectedBrandMenuItem]);

  const handleClickBarMenuItem = (product) => {
    setSelectedBarMenuItem(product);
    setShowBarMenus(false);
  };

  const handleClickBrandMenuItem = (product) => {
    console.log(product);
    setSelectedBrandMenuItem(product);
    setShowBrandCategoryMenus(false);
    // setShowBarMenus(false);
    setShowBrandMenus(true);
    // setShowBrands(true)
  };

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  const router = useRouter();

  const [greetings, setGreetings] = useState([]);
  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/greet/greet"
        );
        setGreetings(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching greetings:", error);
      }
    };

    fetchGreetings();
  }, []);

  useEffect(() => {
    localStorage.removeItem("selectedParentIds");
    localStorage.removeItem("selectedMenusList");
    localStorage.removeItem("selectedItems");
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

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
        const response = await axios.get("http://localhost:5000/api/auth/admins");
        const combinedAdmins = response.data.admins.concat(response.data.adminBars);

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
    const fetchOrderData = async () => {
      try {
        if (orderNumber) {
          console.log(orderNumber);
          const orderResponse = await axios.get(
            `http://localhost:5000/api/order/get/order/${orderNumber}`
          );
          const orderData = orderResponse.data;
          const TotalAC = orderData.acPercentage;
          console.log(orderData);
          // Fetch the tableId from the order data
          const tableId = orderData.tableId;

          // Fetch the section information based on the tableId
          const sectionResponse = await axios.get(
            `http://localhost:5000/api/section/sectionlist/${tableId}`
          );
          const sectionInfo = sectionResponse.data;

          // Set the AC percentage based on the section information
          const fetchedACPercentage = sectionInfo.acPercentage;
          setACPercentage(TotalAC);

          // Set the AC percentage amount based on order data
          // Inside the fetchOrderData function
          const fetchedACPercentageFromOrder =
            orderData.acPercentageAmount || sectionInfo.acPercentage || 0;
          setACPercentageAmount(fetchedACPercentageFromOrder);
          setIsACEnabled(fetchedACPercentageFromOrder > 0);

          // Set the initial state of currentOrder with items from the fetched order
          if (orderData.items) {
            setCurrentOrder(orderData.items);
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderData();
  }, [orderNumber]);

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
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
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.name === product.name);

      if (existingItem) {
        const updatedOrder = prevOrder.map((item) =>
          item.name === existingItem.name
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        );

        const filteredOrder = updatedOrder.filter((item) => item.quantity > 0);

        // Update selectedMenusList in local storage
        const selectedParentIds =
          JSON.parse(localStorage.getItem("selectedParentIds")) || [];
        const selectedMenusList =
          JSON.parse(localStorage.getItem("selectedMenusList")) || [];
        const effectiveSelectedParentId =
          selectedParentId || localStorage.getItem("selectedParentId");
        const parentIndex = selectedParentIds.indexOf(
          effectiveSelectedParentId
        );

        if (parentIndex !== -1) {
          // Find the menu item in selectedMenusList and update its quantity or remove it
          const menuIndex = selectedMenusList[parentIndex].findIndex(
            (menuItem) => menuItem.name === product.name
          );

          if (menuIndex !== -1) {
            if (existingItem.quantity > 1) {
              // Update the quantity in selectedMenusList
              selectedMenusList[parentIndex][menuIndex].quantity -= parseInt(
                product.barCategory.replace("ml", "")
              );
            } else {
              // Remove the item from selectedMenusList if quantity is zero
              selectedMenusList[parentIndex].splice(menuIndex, 1);
            }

            // If no more items exist for the parent, remove the parent from selectedMenusList
            if (selectedMenusList[parentIndex].length === 0) {
              selectedMenusList.splice(parentIndex, 1);
              selectedParentIds.splice(parentIndex, 1);
            }

            // Update local storage
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

        return filteredOrder;
      } else {
        return prevOrder;
      }
    });
  };

  const handleSaveBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return;
      }

      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user",
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log(orderData);
      setOrderID(orderData._id)

      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            price:
              orderItem.price ||
              orderItem.pricePer[`pricePer${orderItem.barCategory}`],
            taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "",
            barCategory: orderItem.barCategory || null,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          };
        }),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        isTemporary: true,
        isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      console.log("Request Body:", { selectedParentIds, selectedMenusList });

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponse.data;
      console.log(existingBill);
      const orderId = existingBill._id;
      const items = existingBill.items;
      console.log(orderId);
      console.log(items);
      setItems(existingBill.items)
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

      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user",
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
      });

      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      // router.push("/order");
      openPaymentModal();
    } catch (error) {
      console.error("Error preparing order:", error);
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

  useEffect(() => {
    if (tableId) {
      axios
        .get(`http://localhost:5000/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }
  }, [tableId]);

  useEffect(() => {
    const handlePageUpKey = (event) => {
      if (event.key === "PageUp") {
        event.preventDefault();
        handleSaveBill(); // Call your function here
      }
    };

    document.addEventListener("keydown", handlePageUpKey);

    return () => {
      document.removeEventListener("keydown", handlePageUpKey);
    };
  }, [handleSaveBill]);

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

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handlePrintBillLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }

      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);
      setOrderID(orderData._id)
     
      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);
      const orderId = existingBill._id;
      const items = existingBill.items;
      console.log(orderId);
      console.log(items);
      setItems(existingBill.items)
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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
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
    const { subtotal, CGST, SGST, total,orderNo, totalQuantity, grandTotal } =
      calculateTotal();
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
    ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"}${NORMAL_SIZE}
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
${LEFT_ALIGN}Bill No: ${orderNumber
      }           Table No: ${
        tableInfo ? tableInfo.tableName : "Table Not Found"
      }    
Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}     
-----------------------------------------
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
    itemName = itemName.slice(0, maxItemNameLength - 3) + '...';
  }
  // Format the first line with SR, first part of the item name, Qty, and Price
  let output = `${String(index + 1)
  .padStart(2) // SR number padded to 2 characters for alignment
  .padEnd(3)} ${itemName.padEnd(20)} ${String(orderItem.quantity)
  .padEnd(3)} ${formattedPrice.padStart(1)}\n`;
  return output;
  }).join("")} -----------------------------------------
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
${index.message}`;}).join("")}---------------------------------------------
  AB Software Solution: 8888732973
  `;

      // You can now pass `billContent` to your print function or display it.
      // Post the formatted bill content to the print API
      const response = await axios.post("http://localhost:5000/print-bill", {
        billContent,
      });

      if (response.status === 200) {
        alert("Bill printed successfully");
      } else {
        alert("Failed to print the bill");
      }

      localStorage.setItem("redirectAfterReload", "true");
      // window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      // window.location.reload();
      openPaymentModal();
      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("redirectAfterReload") === "true") {
      localStorage.removeItem("redirectAfterReload"); // Clean up the flag
      router.push("/order"); // Redirect to the /order page
    }
  });

  const handlePrintBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }

      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);
      setOrderID(orderData._id)
     
      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);
      const orderId = existingBill._id;
      const items = existingBill.items;
      console.log(orderId);
      console.log(items);
      setItems(existingBill.items)
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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
      });

      // Your existing printing logic
      const printContent = preparePrintContent(printOrderData);

      // Write the content to a new window or iframe
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Trigger the print action
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();

      localStorage.setItem("redirectAfterReload", "true");
      // window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      // window.location.reload();
      openPaymentModal();
      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("redirectAfterReload") === "true") {
      localStorage.removeItem("redirectAfterReload"); // Clean up the flag
      router.push("/order"); // Redirect to the /order page
    }
  });

  const preparePrintContent = (printOrderData) => {
    const {
      hotelInfo,
      orderNumber,
      tableInfo,
      acPercentageAmount,
      currentOrder,
      calculateTotal,
      isACEnabled,
      acPercentage,
      customerName,
      mobileNumber,
      waiterName,
    } = printOrderData;

    // Separate menus based on barCategory existence
    const menuWithCategory = currentOrder.filter((item) => item.barCategory);
    const menuWithoutCategory = currentOrder.filter(
      (item) => !item.barCategory
    );

    const generateMenuRows = (menu) => {
      let subtotal = 0;
      let rowsHtml = "";

      // Generate HTML for each menu item in the group
      menu.forEach((orderItem, index) => {
        subtotal += orderItem.price * orderItem.quantity;
        rowsHtml += `
       <tr key=${orderItem._id}>
         <td>${index + 1}</td>
         <td class="menu-name">${orderItem.name}</td>
         <td>${orderItem.quantity}</td>
         <td class="totalprice">${(
           orderItem.price * orderItem.quantity
         ).toFixed(2)}</td>
       </tr>
     `;
      });

       // Only add the subtotal row if there are items in the menu
       if (subtotal > 0) {
        rowsHtml += `
 <tr>
   <td colspan="4" class="subtotal">
     <div style="display: flex; justify-content: space-between; align-items: center;">
       <span>Subtotal</span>
       <span>${subtotal.toFixed(2)}</span>
     </div>
   </td>
 </tr>
`;
      }

    

      return rowsHtml;
    };

    // Generate HTML for menus with and without barCategory
    const menuWithCategoryRows = generateMenuRows(menuWithCategory);
    const menuWithoutCategoryRows = generateMenuRows(menuWithoutCategory);

    // Calculate subtotal for menus with and without barCategory
    const subtotalWithCategory = menuWithCategory.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const subtotalWithoutCategory = menuWithoutCategory.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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
     margin-top:-50px;
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
     border-top: 1.5px dashed black;
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
  
     flex-direction: column;
     align-items: center;
     text-align: center;
    
   }
  
   .footer p {
     margin-top: 2px;
   }
  
   .datetime-containers {
     display: flex;
     align-items: left;
     justify-content: space-between;
     font-size: 12px;
     margin-top: 5px;
     margin-bottom: 8px; /* Adjust the margin as needed */
   }
  
   .label {
     margin-top: -25px;
   }
  
   .datetime-containers p {
     font-size: 10.5px;
     margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
   }
  
   .label {
     margin-top: -20px;
   }
  
   .footerss {
     margin-top: 10px;
   }
  

   .tableAndWaiter {
     margin-top: -7px;
   }
  
   .tableno {
     border-top: 1.5px dashed black;
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
     border-top: 1.5px dashed black;
   }
  
  
 .order-details{
  margin-top:-24px
  position:absolute

 }

   .order-details th {
     padding: 8px;
     text-align: left;
     border-top: 1.5px dotted gray;
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
   .row {
 display: flex;
 justify-content: space-between;
 margin: 5px 0;
}

.label {
 font-weight: medium;
}

.value {
 text-align: right;
}



</style>
</head>
<div class="container">
<div class="hotel-details">
<h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
  <img class="logo" src="http://localhost:5000/${
    hotelInfo.hotelLogo
  }" alt="Hotel Logo" style="max-height: 100px;max-width: 100px" />

<p class="address">${hotelInfo ? hotelInfo.address : "Address Not Found"}</p>
<p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}</p>
<p style="${!hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""}">GSTIN: ${
      hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"
    }</p>
<p style="${!hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""}">SAC No: ${
      hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"
    }</p>
<p style="${
      !hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
    }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
</div>

<!-- Content Section -->
<!-- Table and Contact Details Section -->
<div class="tableno reduce-space">
  <p>Bill No: ${orderNumber}</p>
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

<!-- Items with Categories -->


<div class="order-details reduce-margin-top">
   ${menuWithCategoryRows ? `
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
           ${menuWithCategoryRows}
       </tbody>
   </table>
   <div class="subtotal">
       
  
      
          ${
            hotelInfo && hotelInfo.vatPercentage > 0
              ? `
              <div style="display: flex; justify-content: space-between; margin-top:-1px;margin-bottom:7px;font-size:11px;">
               <span>VAT (${hotelInfo.vatPercentage}%)</span>
              <span>${calculateTotal(currentOrder).VAT}</span>
              </div>`
              : ""
          }
     
      

       ${Math.round(calculateTotal(currentOrder).total) > 0 ? `
           <div style="display: flex; justify-content: space-between; margin-top:-1px;margin-bottom:9px;font-size:15px;">
               <span>Bar Total</span>
               <span>${Math.round(calculateTotal(currentOrder).total)}</span>
           </div>` : ""
       }
           
   </div>
   ` : ""}
</div>


<div class="order-details reduce-margin-top">
   ${menuWithoutCategoryRows ? `
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
           ${menuWithoutCategoryRows}
       </tbody>
   </table>
   
   
   ` : ""}
</div>

<!-- GST and Menu Totals -->
<div class="datas">
  ${
    hotelInfo && hotelInfo.gstPercentage > 0
      ? `
      ${
        calculateTotal(currentOrder).CGST > 0
          ? `
          <div style="display: flex; justify-content: space-between;">
            <span>CGST (${hotelInfo.gstPercentage / 2}%)</span>
            <span>${calculateTotal(currentOrder).CGST}</span>
          </div>`
          : ""
      }
      ${
        calculateTotal(currentOrder).SGST > 0
          ? `
          <div style="display: flex; justify-content: space-between;">
            <span>SGST (${hotelInfo.gstPercentage / 2}%)</span>
            <span>${calculateTotal(currentOrder).SGST}</span>
          </div>`
          : ""
      }`
      : ""
  }

  ${
    Math.round(calculateTotal(currentOrder).menuTotal) > 0
      ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; margin-top: 1px; font-size: 12px;">
        <span>Menu Total</span>
        <span>${Math.round(calculateTotal(currentOrder).menuTotal)}</span>
      </div>`
      : ""
  }

  ${
    acPercentage > 0 && calculateTotal(currentOrder).acPercentageAmount > 0
      ? `
      <div style="display: flex; justify-content: space-between;  border-top: 1.5px dashed black; margin-bottom: 7px; margin-top: 2px; font-size: 11px;">
        <span>AC (${acPercentage}%)</span>
        <span>${calculateTotal(currentOrder).acPercentageAmount}</span>
      </div>`
      : ""
  }

  ${
    discount > 0
      ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; margin-top: 3px; font-size: 12px;">
        <span>Discount</span>
        <span>${discount}</span>
      </div>`
      : ""
  }

  <p style="display: flex; justify-content: space-between; font-size: 1.5em;">
    <span>Grand Total</span>
    <span>${Math.round(calculateTotal(currentOrder).grandTotal - discount)}</span>
  </p>
</div>


<!-- Items without barCategory Section -->
<div class="order-details reduce-margin-top">
   <table class="table-class">
  
   </table>


  
   <div class="datas">
   <!-- Include content or styling for AC section if needed -->
  
  

  
</div>

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
</div>
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

    return printContent;
  };

  const handlePrintLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }

      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);

      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        // isTemporary: true, // Set isTemporary to false explicitly
        // isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);

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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
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
    const { subtotal, CGST, SGST, total,orderNo, totalQuantity, grandTotal } =
      calculateTotal();
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
    ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"}${NORMAL_SIZE}
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
${LEFT_ALIGN}Bill No: ${orderNumber
      }           Table No: ${
        tableInfo ? tableInfo.tableName : "Table Not Found"
      }    
Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}     
-----------------------------------------
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
    itemName = itemName.slice(0, maxItemNameLength - 3) + '...';
  }
  // Format the first line with SR, first part of the item name, Qty, and Price
  let output = `${String(index + 1)
  .padStart(2) // SR number padded to 2 characters for alignment
  .padEnd(3)} ${itemName.padEnd(20)} ${String(orderItem.quantity)
  .padEnd(3)} ${formattedPrice.padStart(1)}\n`;
  return output;
  }).join("")} -----------------------------------------
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
${index.message}`;}).join("")}---------------------------------------------
  AB Software Solution: 8888732973
  `;

      // You can now pass `billContent` to your print function or display it.
      // Post the formatted bill content to the print API
      const response = await axios.post("http://localhost:5000/print-bill", {
        billContent,
      });

      if (response.status === 200) {
        alert("Bill printed successfully");
      } else {
        alert("Failed to print the bill");
      }

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      window.location.reload();

      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("redirectAfterReload") === "true") {
      localStorage.removeItem("redirectAfterReload"); // Clean up the flag
      router.push("/order"); // Redirect to the /order page
    }
  });

  const handlePrint = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }

      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);

      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        // isTemporary: true, // Set isTemporary to false explicitly
        // isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);

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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
      });

      // Your existing printing logic
      const printContent = preparePrint(printOrderData);

      // Write the content to a new window or iframe
      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Trigger the print action
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      window.location.reload();

      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("redirectAfterReload") === "true") {
      localStorage.removeItem("redirectAfterReload"); // Clean up the flag
      router.push("/order"); // Redirect to the /order page
    }
  });

  const preparePrint = (printOrderData) => {
    const {
      hotelInfo,
      orderNumber,
      tableInfo,
      acPercentageAmount,
      currentOrder,
      calculateTotal,
      isACEnabled,
      acPercentage,
      customerName,
      mobileNumber,
      waiterName,
    } = printOrderData;

    // Separate menus based on barCategory existence
    const menuWithCategory = currentOrder.filter((item) => item.barCategory);
    const menuWithoutCategory = currentOrder.filter(
      (item) => !item.barCategory
    );

    const generateMenuRows = (menu) => {
      let subtotal = 0;
      let rowsHtml = "";

      // Generate HTML for each menu item in the group
      menu.forEach((orderItem, index) => {
        subtotal += orderItem.price * orderItem.quantity;
        rowsHtml += `
              <tr key=${orderItem._id}>
                  <td>${index + 1}</td>
                  <td class="menu-name">${orderItem.name}</td>
                  <td>${orderItem.quantity}</td>
                  <td class="totalprice">${(
                    orderItem.price * orderItem.quantity
                  ).toFixed(2)}</td>
              </tr>
          `;
      });

     // Only add the subtotal row if there are items in the menu
     if (subtotal > 0) {
      rowsHtml += `
<tr>
 <td colspan="4" class="subtotal">
   <div style="display: flex; justify-content: space-between; align-items: center;">
     <span>Subtotal</span>
     <span>${subtotal.toFixed(2)}</span>
   </div>
 </td>
</tr>
`;
    }

    return rowsHtml;
  };

    // Generate HTML for menus with and without barCategory
    const menuWithCategoryRows = generateMenuRows(menuWithCategory);
    const menuWithoutCategoryRows = generateMenuRows(menuWithoutCategory);

    // Calculate subtotal for menus with and without barCategory
    const subtotalWithCategory = menuWithCategory.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const subtotalWithoutCategory = menuWithoutCategory.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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
     margin-top:-50px;
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
        border-top: 1.5px dashed black;
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
     
        flex-direction: column;
        align-items: center;
        text-align: center;
       
      }
     
      .footer p {
        margin-top: 2px;
      }
     
      .datetime-containers {
     display: flex;
     align-items: left;
     justify-content: space-between;
     font-size: 12px;
     margin-top: 5px;
     margin-bottom: 8px; /* Adjust the margin as needed */
   }
  
   .label {
     margin-top: -25px;
   }
  
   .datetime-containers p {
     font-size: 10.5px;
     margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
   }
  
   .label {
     margin-top: -20px;
   }
     
      .footerss {
        margin-top: 29px;
      }
     
   
      .tableAndWaiter {
        margin-top: -7px;
      }
     
      .tableno {
        border-top: 1.5px dashed black;
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
        border-top: 1.5px dashed black;
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

  <p class="address">${hotelInfo ? hotelInfo.address : "Address Not Found"}</p>
  <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"}</p>
  <p style="${!hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""}">GSTIN: ${
      hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"
    }</p>
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
  <p>Bill No:${orderNumber}
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

<!-- Items with Categories -->


<div class="order-details reduce-margin-top">
   ${menuWithCategoryRows ? `
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
           ${menuWithCategoryRows}
       </tbody>
   </table>
   <div class="subtotal">
       
  
      
          ${
            hotelInfo && hotelInfo.vatPercentage > 0
              ? `
              <div style="display: flex; justify-content: space-between; margin-top:-1px;margin-bottom:7px;font-size:11px;">
               <span>VAT (${hotelInfo.vatPercentage}%)</span>
              <span>${calculateTotal(currentOrder).VAT}</span>
              </div>`
              : ""
          }
     
      

       ${Math.round(calculateTotal(currentOrder).total) > 0 ? `
           <div style="display: flex; justify-content: space-between; margin-top:-1px;margin-bottom:9px;font-size:15px;">
               <span>Bar Total</span>
               <span>${Math.round(calculateTotal(currentOrder).total)}</span>
           </div>` : ""
       }
           
   </div>
   ` : ""}
</div>


<div class="order-details reduce-margin-top">
   ${menuWithoutCategoryRows ? `
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
           ${menuWithoutCategoryRows}
       </tbody>
   </table>
   
   
   ` : ""}
</div>

<!-- GST and Menu Totals -->
<div class="datas">
  ${
    hotelInfo && hotelInfo.gstPercentage > 0
      ? `
      ${
        calculateTotal(currentOrder).CGST > 0
          ? `
          <div style="display: flex; justify-content: space-between;">
            <span>CGST (${hotelInfo.gstPercentage / 2}%)</span>
            <span>${calculateTotal(currentOrder).CGST}</span>
          </div>`
          : ""
      }
      ${
        calculateTotal(currentOrder).SGST > 0
          ? `
          <div style="display: flex; justify-content: space-between;">
            <span>SGST (${hotelInfo.gstPercentage / 2}%)</span>
            <span>${calculateTotal(currentOrder).SGST}</span>
          </div>`
          : ""
      }`
      : ""
  }

  ${
    Math.round(calculateTotal(currentOrder).menuTotal) > 0
      ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; margin-top: 1px; font-size: 12px;">
        <span>Menu Total</span>
        <span>${Math.round(calculateTotal(currentOrder).menuTotal)}</span>
      </div>`
      : ""
  }

  ${
    acPercentage > 0 && calculateTotal(currentOrder).acPercentageAmount > 0
      ? `
      <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed black; margin-bottom: 7px; margin-top: 3px; font-size: 11px;">
        <span>AC (${acPercentage}%)</span>
        <span>${calculateTotal(currentOrder).acPercentageAmount}</span>
      </div>`
      : ""
  }

  ${
    discount > 0
      ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; margin-top: 3px; font-size: 12px;">
        <span>Discount</span>
        <span>${discount}</span>
      </div>`
      : ""
  }

  <p style="display: flex; justify-content: space-between; font-size: 1.5em;">
    <span>Grand Total</span>
    <span>${Math.round(calculateTotal(currentOrder).grandTotal - discount)}</span>
  </p>
</div>
  
  <!-- Items without barCategory Section -->
  <div class="order-details reduce-margin-top">
      <table class="table-class">
     
      </table>
 
    
     
      <div class="datas">
      <!-- Include content or styling for AC section if needed -->
     
     

     
  </div>
   
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
</div>
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

    return printContent;
  };

  const handleOnlineBillLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }

      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);

      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        // isTemporary: true, // Set isTemporary to false explicitly
        // isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);

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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      console.log(printOrderData);
      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
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
      const { subtotal, CGST, SGST, total,orderNo, totalQuantity, grandTotal } =
        calculateTotal();
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
      ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"}${NORMAL_SIZE}
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
  ${LEFT_ALIGN}Bill No: ${orderNumber
        }           Table No: ${
          tableInfo ? tableInfo.tableName : "Table Not Found"
        }    
  Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}     
  -----------------------------------------
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
      itemName = itemName.slice(0, maxItemNameLength - 3) + '...';
    }
    // Format the first line with SR, first part of the item name, Qty, and Price
    let output = `${String(index + 1)
    .padStart(2) // SR number padded to 2 characters for alignment
    .padEnd(3)} ${itemName.padEnd(20)} ${String(orderItem.quantity)
    .padEnd(3)} ${formattedPrice.padStart(1)}\n`;
    return output;
    }).join("")} -----------------------------------------
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
  ${index.message}`;}).join("")}---------------------------------------------
    AB Software Solution: 8888732973
    `;
  
        // You can now pass `billContent` to your print function or display it.
        // Post the formatted bill content to the print API
        const response = await axios.post("http://localhost:5000/print-bill", {
          billContent,
        });
  
        if (response.status === 200) {
          alert("Bill printed successfully");
        } else {
          alert("Failed to print the bill");
        }  

     // After printing, update the order by cash
   const orderIdToUpdate = existingBill._id; // Assuming this is already fetched
   const onlinePaymentAmount = calculateTotal().grandTotal; // Cash amount is the grand total
  
   // Call API to update the order with cash payment
   await axios.patch(`http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`, {
     items: existingBill.items,
     subtotal: existingBill.subtotal,
     barSubtotal: existingBill.barSubtotal,
     VAT: existingBill.VAT,
     CGST: existingBill.CGST,
     SGST: existingBill.SGST,
     total: existingBill.total,
     grandTotal: calculateTotal.grandTotal,
     acPercentageAmount: existingBill.acPercentageAmount,
     acPercentage: existingBill.acPercentage,
     vatPercentage: existingBill.vatPercentage,
     gstPercentage: existingBill.gstPercentage,
     waiterName: existingBill.waiterName,
     isTemporary: false,
     isPrint: 0,
     cashAmount: 0, // Assigning the total to cashAmount
     onlinePaymentAmount,
     dueAmount: 0,
     complimentaryAmount: 0,
     discount: 0,
     lastTotal: onlinePaymentAmount,
   });

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      window.location.reload();

      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const handleOnlineBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }
  
      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();
  
      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });
  
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
  
      const itemsForStockIn = [];
  
      currentOrder.forEach((orderItem) => {
        // Skip items with null barCategory
        if (!orderItem.barCategory) return;
  
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;
  
        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });
  
          const selectedParentId = selectedParentIds[parentIdIndex];
  
          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });
  
      // Only make stockIn API call if itemsForStockIn is not empty
      if (itemsForStockIn.length > 0) {
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }
  
      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });
      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);

      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        // isTemporary: true, // Set isTemporary to false explicitly
        // isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);

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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      console.log(printOrderData);
      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
      });

      // Your existing printing logic
      const printContent = preparePrint(printOrderData);

      // Write the content to a new window or iframe
      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Trigger the print action
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();

     // After printing, update the order by cash
   const orderIdToUpdate = existingBill._id; // Assuming this is already fetched
   const onlinePaymentAmount = calculateTotal().grandTotal; // Cash amount is the grand total
  
   // Call API to update the order with cash payment
   await axios.patch(`http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`, {
     items: existingBill.items,
     subtotal: existingBill.subtotal,
     barSubtotal: existingBill.barSubtotal,
     VAT: existingBill.VAT,
     CGST: existingBill.CGST,
     SGST: existingBill.SGST,
     total: existingBill.total,
     grandTotal: calculateTotal.grandTotal,
     acPercentageAmount: existingBill.acPercentageAmount,
     acPercentage: existingBill.acPercentage,
     vatPercentage: existingBill.vatPercentage,
     gstPercentage: existingBill.gstPercentage,
     waiterName: existingBill.waiterName,
     isTemporary: false,
     isPrint: 0,
     cashAmount: 0, // Assigning the total to cashAmount
     onlinePaymentAmount,
     dueAmount: 0,
     complimentaryAmount: 0,
     discount: 0,
     lastTotal: onlinePaymentAmount,
   });

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      window.location.reload();

      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  const handleCashBillLan = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }

      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();

      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });

      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];

      const itemsForStockIn = [];

      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;

        if (decreasedQuantity > 0) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });

          const selectedParentId = selectedParentIds[parentIdIndex];

          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });

      if (itemsForStockIn.length > 0) {
        // Make the stockIn API call with only decreased quantities
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }

      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });

      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);

      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        // isTemporary: true, // Set isTemporary to false explicitly
        // isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);

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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      console.log(printOrderData);
      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
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
      const { subtotal, CGST, SGST, total,orderNo, totalQuantity, grandTotal } =
        calculateTotal();
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
      ${CENTER_ALIGN}${DOUBLE_SIZE_ON}${"    "}${hotelInfo ? hotelInfo.hotelName.toUpperCase() : "HOTEL NOT FOUND"}${NORMAL_SIZE}
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
  ${LEFT_ALIGN}Bill No: ${orderNumber
        }           Table No: ${
          tableInfo ? tableInfo.tableName : "Table Not Found"
        }    
  Date: ${formatDate(currentDate)}      Time: ${formatTime(currentDate)}     
  -----------------------------------------
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
      itemName = itemName.slice(0, maxItemNameLength - 3) + '...';
    }
    // Format the first line with SR, first part of the item name, Qty, and Price
    let output = `${String(index + 1)
    .padStart(2) // SR number padded to 2 characters for alignment
    .padEnd(3)} ${itemName.padEnd(20)} ${String(orderItem.quantity)
    .padEnd(3)} ${formattedPrice.padStart(1)}\n`;
    return output;
    }).join("")} -----------------------------------------
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
  ${index.message}`;}).join("")}---------------------------------------------
    AB Software Solution: 8888732973
    `;
  
        // You can now pass `billContent` to your print function or display it.
        // Post the formatted bill content to the print API
        const response = await axios.post("http://localhost:5000/print-bill", {
          billContent,
        });
  
        if (response.status === 200) {
          alert("Bill printed successfully");
        } else {
          alert("Failed to print the bill");
        }  

     // After printing, update the order by cash
   const orderIdToUpdate = existingBill._id; // Assuming this is already fetched
   const cashAmount = calculateTotal().grandTotal; // Cash amount is the grand total
  
   // Call API to update the order with cash payment
   await axios.patch(`http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`, {
     items: existingBill.items,
     subtotal: existingBill.subtotal,
     barSubtotal: existingBill.barSubtotal,
     VAT: existingBill.VAT,
     CGST: existingBill.CGST,
     SGST: existingBill.SGST,
     total: existingBill.total,
     grandTotal: calculateTotal.grandTotal,
     acPercentageAmount: existingBill.acPercentageAmount,
     acPercentage: existingBill.acPercentage,
     vatPercentage: existingBill.vatPercentage,
     gstPercentage: existingBill.gstPercentage,
     waiterName: existingBill.waiterName,
     isTemporary: false,
     isPrint: 0,
     cashAmount, // Assigning the total to cashAmount
     onlinePaymentAmount: 0,
     dueAmount: 0,
     complimentaryAmount: 0,
     discount: 0,
     lastTotal: cashAmount,
   });

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      window.location.reload();

      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("redirectAfterReload") === "true") {
      localStorage.removeItem("redirectAfterReload"); // Clean up the flag
      router.push("/order"); // Redirect to the /order page
    }
  });

  const handleCashBill = async () => {
    try {
      if (currentOrder.length === 0) {
        alert("No menu items added to the order.");
        return; // Exit the function if no menu items are added
      }
  
      // Fetch the initial order data
      const initialOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const initialOrderData = initialOrderResponse.data;
      const initialItemsMap = new Map();
  
      initialOrderData.items.forEach((item) => {
        initialItemsMap.set(item.name, item.quantity);
      });
  
      const selectedParentIds =
        JSON.parse(localStorage.getItem("selectedParentIds")) || [];
      const selectedMenusList =
        JSON.parse(localStorage.getItem("selectedMenusList")) || [];
  
      const itemsForStockIn = [];
  
      currentOrder.forEach((orderItem) => {
        const previousQuantity = initialItemsMap.get(orderItem.name) || 0;
        const decreasedQuantity = previousQuantity - orderItem.quantity;
  
        // Check if barCategory is not null before processing for stockIn
        if (decreasedQuantity > 0 && orderItem.barCategory !== null) {
          const slicedOrderItemName = orderItem.name.slice(
            0,
            orderItem.name.lastIndexOf(" ")
          );
          const parentIdIndex = selectedParentIds.findIndex((parentId) => {
            const slicedParentId = parentId.slice(0, parentId.lastIndexOf(" "));
            return slicedParentId === slicedOrderItemName;
          });
  
          const selectedParentId = selectedParentIds[parentIdIndex];
  
          itemsForStockIn.push({
            name: orderItem.name,
            quantity: decreasedQuantity,
            selectedParentId: orderItem.selectedParentId || selectedParentId,
          });
        }
      });
  
      // Only call stockIn API if there are valid items (with non-null barCategory)
      if (itemsForStockIn.length > 0) {
        await axios.post(
          "http://localhost:5000/api/liquorBrand/liquorBrand/stockIn",
          {
            items: itemsForStockIn,
          }
        );
      }
  
      // Log the initial state of the order before any updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: initialOrderData,
      });  
      // Fetch the order again if needed
      const orderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const orderData = orderResponse.data;
      console.log("Order data after fetching:", orderData);

      // Fetch the tableId from the order data
      const tableId = orderData.tableId;
      const tableResponse = await axios.get(
        `http://localhost:5000/api/table/tables/${tableId}`
      );
      const tableInfo = tableResponse.data;

      // Construct the API endpoint for updating the order based on order number
      const updateOrderEndpoint = `http://localhost:5000/api/order/update-order-by-number/${orderNumber}`;

      // Use the tableId from the order data
      const orderDataToUpdate = {
        tableId: tableInfo._id,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price
            ? orderItem.price
            : orderItem.pricePer[`pricePer${orderItem.barCategory}`],
          barCategory: orderItem.barCategory ? orderItem.barCategory : null,
        })),
        subtotal: calculateTotal(currentOrder).subtotal,
        barSubtotal: calculateTotal(currentOrder).barSubtotal,
        CGST: calculateTotal(currentOrder).CGST,
        SGST: calculateTotal(currentOrder).SGST,
        VAT: calculateTotal(currentOrder).VAT,
        acPercentageAmount: calculateUpdatedACPercentageAmount(
          isACEnabled,
          acPercentageAmount,
          acPercentage,
          currentOrder
        ),
        total: calculateTotal(currentOrder).total,
        grandTotal: calculateTotal(currentOrder).grandTotal,
        menuTotal: calculateTotal(currentOrder).menuTotal,
        acPercentageAmount: calculateTotal(currentOrder).acPercentageAmount,
        // isTemporary: true, // Set isTemporary to false explicitly
        // isPrint: 1,
      };

      await axios.patch(updateOrderEndpoint, orderDataToUpdate);

      const updatedOrderResponsed = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );
      const existingBill = updatedOrderResponsed.data;
      console.log(existingBill);

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

      const updatedOrderResponse = await axios.get(
        `http://localhost:5000/api/order/get/order/${orderNumber}`
      );

      const updatedOrderData = updatedOrderResponse.data;
      const customerName = updatedOrderData.customerName;
      const mobileNumber = updatedOrderData.mobileNumber;
      const waiterName = updatedOrderData.waiterName;

      const printOrderData = {
        hotelInfo: hotelInfo,
        orderNumber: orderNumber,
        tableInfo: tableInfo,
        currentOrder: updatedOrderData.items || [],
        calculateTotal: calculateTotal, // Assuming calculateTotal is a function available in your context
        isACEnabled: isACEnabled,
        acPercentageAmount: acPercentageAmount,
        acPercentage: acPercentage,
        customerName: customerName,
        mobileNumber: mobileNumber,
        waiterName: waiterName,
      };

      console.log(printOrderData);
      // Log the updated state of the order after updates
      await axios.post(`http://localhost:5000/api/logHistory/log-history`, {
        orderNumber: orderNumber,
        updatedBy: "user", // You can replace this with the actual user information
        timestamp: new Date(),
        updatedFields: orderDataToUpdate,
      });

      // Your existing printing logic
      const printContent = preparePrint(printOrderData);

      // Write the content to a new window or iframe
      const printWindow = window.open("", "_self");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Trigger the print action
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();

     // After printing, update the order by cash
   const orderIdToUpdate = existingBill._id; // Assuming this is already fetched
   const cashAmount = calculateTotal().grandTotal; // Cash amount is the grand total
  
   // Call API to update the order with cash payment
   await axios.patch(`http://localhost:5000/api/order/update-order-by-id/${orderIdToUpdate}`, {
     items: existingBill.items,
     subtotal: existingBill.subtotal,
     barSubtotal: existingBill.barSubtotal,
     VAT: existingBill.VAT,
     CGST: existingBill.CGST,
     SGST: existingBill.SGST,
     total: existingBill.total,
     grandTotal: calculateTotal.grandTotal,
     acPercentageAmount: existingBill.acPercentageAmount,
     acPercentage: existingBill.acPercentage,
     vatPercentage: existingBill.vatPercentage,
     gstPercentage: existingBill.gstPercentage,
     waiterName: existingBill.waiterName,
     isTemporary: false,
     isPrint: 0,
     cashAmount, // Assigning the total to cashAmount
     onlinePaymentAmount: 0,
     dueAmount: 0,
     complimentaryAmount: 0,
     discount: 0,
     lastTotal: cashAmount,
   });

      localStorage.setItem("redirectAfterReload", "true");
      window.location.reload();

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);
      localStorage.removeItem("selectedParentIds");
      localStorage.removeItem("selectedMenusList");
      localStorage.removeItem("selectedItems");
      window.location.reload();

      // Redirect to the bill page
      // router.push("/order");

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error preparing order:", error);
      const productNameMatch = /Insufficient stock for item (.*)/.exec(
        error.response?.data?.error
      );
      const productName = productNameMatch
        ? productNameMatch[1]
        : "Unknown Product";

      // Set state to display popup with productName
      setShowPopup(true);
      setProductName(productName);
    }
  };

  window.addEventListener("load", () => {
    if (localStorage.getItem("redirectAfterReload") === "true") {
      localStorage.removeItem("redirectAfterReload"); // Clean up the flag
      router.push("/order"); // Redirect to the /order page
    }
  });


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/main")
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get("http://localhost:5000/api/menu/menus/list")
      .then((response) => {
        const menusArray = response.data;
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

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
        console.log(response.data);
        setBarCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch products
    axios
      .get("http://localhost:5000/api/menu/menus/list")
      .then((response) => {
        console.log(response.data);
        const menusArray = response.data; // Ensure menus is an array
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    if (tableId) {
      axios
        .get(`http://localhost:5000/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }

    const savedBills =
      JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
    if (savedBills.length > 0) {
      // Assuming you want to load the latest saved bill
      const latestOrder = savedBills[savedBills.length - 1];
      setCurrentOrder(latestOrder.items || []); // Initialize currentOrder with the saved items
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
    const GSTRate = gstPercentage / 100; // Use GST percentage if enabled
    const CGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for CGST
    const SGST = (GSTRate / 2) * subtotalWithoutBarCategory; // Half of the GST for SGST

    // Include acPercentage in the total calculation
    // const acPercentageAmount = isACEnabled
    //   ? (subtotalWithBarCategory + subtotalWithoutBarCategory) *
    //     (acPercentage / 100)
    //   : 0;

    const menuTotal = subtotalWithoutBarCategory + CGST + SGST;
    const total = subtotalWithBarCategory + VAT ;
    const grandTotal =
      menuTotal + total + acPercentageAmount ;

    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    // Fetch discount from currentOrder
    const discount = currentOrder.reduce((acc, orderItem) => {
      return acc + (orderItem.discount || 0); // Add the discount if available for each item
    }, 0);

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
      discount: discount.toFixed(2), // Return discount for further use if needed
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
  const [discount, setDiscount] = useState(0); // Add this line for the GST percentage

  const updateOrderItem = (updatedItem) => {
    setCurrentOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.name === updatedItem.name
          ? { ...item, quantity: updatedItem.quantity }
          : item
      )
    );
    closeEditOrderModal();
  };

  useEffect(() => {
    const fetchHotelInfoAndSetGSTPercentage = async () => {
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

          // Fetch current order and calculate total CGST
          const updatedOrderResponse = await axios.get(
            `http://localhost:5000/api/order/get/order/${orderNumber}`
          );
          const updatedOrderData = updatedOrderResponse.data;
          const currentOrder = updatedOrderData;
          const totalGST = currentOrder.gstPercentage;
          const totalVAT = currentOrder.vatPercentage;
          const totalDiscount = currentOrder.discount;

          setGSTPercentage(totalGST || 0);
          setVATPercentage(totalVAT || 0);
          setDiscount(totalDiscount || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfoAndSetGSTPercentage();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const updateOrder = (updatedOrderItem) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.name === updatedOrderItem.name ? updatedOrderItem : item
      );
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
    updateOrder(updatedOrderItem);
  };
  const [ProductName, setProductName] = useState("");

  const home = () => {
    router.push("/order");
  };

  return (
    <div className=" font-sans lg:mt-3 md:mt-0 mt-1 ">
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
      {/* <!-- component --> */}
      <div className="container mx-auto  bg-white">
        <div className="flex lg:flex-row  shadow-lg">
          <div className=" w-full lg:w-2/5 pl-5 bg-gray-100 md:w-96 lg:-mt-3 -mt-2 md:-mt-1">
            {/* <!-- header --> */}
            <div className="mr-5 lg:ml-2 mt-10">
              <FontAwesomeIcon
                icon={faTurnUp}
                onClick={home}
                className=" cursor-pointer text-2xl text-orange-700 flex item-center"
              />
            </div>

            <div className="flex flex-row items-center justify-center px-2 -mt-5">
              <div className="font-bold text-lg ">
                View / Edit Bill No.{orderNumber}
              </div>
              <div
                className="md:hidden cursor-pointer mr-20 absolute -right-16 mb-2 rounded-md"
                onClick={handleToggle}
              >
                <svg viewBox="0 0 10 8" width="30">
                  <path
                    d="M1 1h8M1 4h 8M1 7h8"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            {/* <!-- end header --> */}
            {/* <!-- order list --> */}
            <div className=" ">
              <div className="p-1 mt-3 custom-scrollbars overflow-y-auto lg:h-64 md:h-56 h-52 lg:text-sm md:text-sm text-xs">
                {currentOrder.map((orderItem) => (
                  <div key={orderItem._id} className="flex items-center mb-1">
                    <div className="flex flex-row items-center ">
                      <div className="flex items-center h-full">
                        <span className=" font-semibold lg:w-52 md:w-44 w-60 sm:text-xs md:text-xs   lg:text-base lg:ml-1 text-sm">
                          {orderItem.name}
                        </span>
                      </div>
                    </div>
                    <div className="float-right flex justify-between md:ml-1 mt-2 lg:ml-10">
                      <span
                        className="rounded-md cursor-pointer  align-middle text-center  
                         font-bold p-1 lg:w-4 lg:text-md md:w-4 sm:w-4 ml-2 lg:mr-5"
                        onClick={() => removeFromOrder(orderItem)}
                      >
                        <FontAwesomeIcon
                          icon={faCircleMinus}
                          size="xl"
                          style={{ color: "#f25236" }}
                        />
                      </span>
                      <input
                        type="number"
                        value={orderItem.quantity}
                        onChange={(e) => handleQuantityChange(e, orderItem)}
                        className="font-semibold lg:w-10 md:w-10 w-10 justify-center flex text-center rounded-md align-center md:text-xs pl-0 mr-1 "
                        min={1}
                      />
                      <span
                        className="rounded-md cursor-pointer  sm:w-4  lg:w-6 justify-center flex align-middle text-center  md:w-4 font-bold lg:ml-1 p-1 sm:p-0 lg:text-md lg:mt-1"
                        onClick={() => addToOrder(orderItem)}
                      >
                        <FontAwesomeIcon
                          icon={faCirclePlus}
                          size="xl"
                          style={{ color: "#f25236" }}
                        />
                      </span>
                    </div>
                    <div className="font-semibold  lg:text-sm float-right md:text-md text-xs mt-1  text-right lg:ml-3  ml-7 lg:mt-0  md:mt-0 sm:mt-0  sm:text-xs sm:w-20 ">
                      {/* {`₹${(orderItem.price * orderItem.quantity)}`} */}
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
            </div>

            {/* <!-- end order list --> */}
            {/* <!-- totalItems --> */}
            <div className="px-5 lg:mt-1 md:mt-10 mt-48 lg:ml-0 md:-ml-1 ml-0 lg:text-sm md:text-sm text-xs sm:ml-2">
              <div className="py-1 rounded-md shadow-md bg-white lg:mt-2 ">
                {calculateTotal(currentOrder).menuTotal > 0 && ( // Render AC Amount section only if AC is enabled
                  <div className="px-4 flex justify-between ">
                    <span className="font-semibold text-sm">Menu Subtotal</span>
                    <span className="font-semibold">
                      ₹{calculateTotal(currentOrder).subtotal}
                    </span>
                  </div>
                )}

                {calculateTotal(currentOrder).barSubtotal > 0 && ( // Render AC Amount section only if AC is enabled
                  <div className="px-4 flex justify-between ">
                    <span className="font-semibold text-sm">
                      Liquor Subtotal
                    </span>
                    <span className="font-semibold">
                      ₹{calculateTotal(currentOrder).barSubtotal}
                    </span>
                  </div>
                )}

                {acPercentageAmount > 0 && ( // Render AC Amount section only if AC is enabled
                  <div className="px-4 flex justify-between">
                    <span className="font-semibold text-sm">AC Charges</span>
                    <span className="font-bold">
                      ({acPercentage}%) ₹
                      {calculateTotal(currentOrder).acPercentageAmount}
                    </span>
                  </div>
                )}

                {calculateTotal(currentOrder).VAT > 0 && ( // Render AC Amount section only if AC is enabled
                  <div className="px-4 flex justify-between">
                    <span className="font-semibold text-sm">VAT</span>
                    <span className="font-bold">
                      ({vatPercentage}%) ₹{calculateTotal(currentOrder).VAT}
                    </span>
                  </div>
                )}

                {(calculateTotal(currentOrder).CGST > 0 ||
                  calculateTotal(currentOrder).SGST > 0) && ( // Check if either CGST or SGST exists
                  <div>
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">CGST</span>
                      <span className="font-semibold">
                        ({gstPercentage / 2}%) ₹
                        {calculateTotal(currentOrder).CGST}
                      </span>
                    </div>
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">SGST</span>

                      <span className="font-semibold">
                        ({gstPercentage / 2}%) ₹
                        {calculateTotal(currentOrder).SGST}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t-2 lg:px-4  px-1 flex items-center justify-between mt-1">
                  <span className=" font-base text-xl lg:text-lg">Total</span>
                  <span className="font-semibold text-lg lg:text-lg lg:mr-0 md:mr-2">
                    {/* ₹{(calculateTotal().total)} */}₹
                    {Math.round(calculateTotal(currentOrder).grandTotal)}
                  </span>
                  {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                </div>

                {discount > 0 && (
                  <div className="px-4">
                    {/* Discount Section */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Discount</span>
                      <span className="font-semibold">₹{discount}</span>
                    </div>

                    {/* Grand Total Section */}
                    <div className="py-1 flex items-center justify-between">
                      <span className="font-semibold text-xl lg:text-xl">
                        Grand Total
                      </span>
                      <span className="font-semibold text-xl lg:text-2xl">
                        ₹
                        {Math.round(calculateTotal(currentOrder).grandTotal) -
                          discount}
                      </span>
                    </div>
                  </div>
                )}
                <div className="px-5 text-left text-sm  text-gray-500 font-sans font-semibold">
                  Total Items: {calculateTotal(currentOrder).totalQuantity}
                </div>
              </div>
            </div>
            {/* <!-- end total --> */}

            {/* <!-- button pay--> */}
            {/* <div className="flex px-5 mt-5 justify-between ">
              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-2 py-2 rounded-md text-center bg-green-700 hover:bg-green-600 text-white font-bold cursor-pointer text-xs"
                  onClick={handlePrintBill}
                >
                  Print-Bill ( * )
                </div>
              </div>

              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-2 py-2 rounded-md text-center bg-green-700 hover:bg-green-600 text-white font-bold cursor-pointer text-xs"
                  onClick={handlePrint}
                >
                  Duplicate-Bill
                </div>
              </div>

              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-2 py-2 rounded-md text-center bg-blue-600 text-white font-bold cursor-pointer text-xs "
                  onClick={handleSaveBill}
                >
                  Save (Pg Up)
                </div>
              </div>
              {isDirectState && (
              <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                      <div
                        className="px-5 py-2 rounded-md text-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer text-xs"
                        onClick={handleCashBill}
                      >
                        Cash
                      </div>
                    </div>
              )}
               {isDirectState && (
                    <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                      <div
                        className="px-4 py-2 lg:py-2 rounded-md text-center bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer text-xs"
                        onClick={handleOnlineBill}
                      >
                        Online
                      </div>
                    </div>
               )}
            </div> */}
              {/* <!-- button pay--> */}
              <div className="flex px-5 mt-5 justify-between ">
            {!isLanBillState && (
              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-2 py-2 rounded-md text-center bg-green-700 hover:bg-green-600 text-white font-bold cursor-pointer text-xs"
                  onClick={handlePrintBill}
                >
                  Print-Bill ( * )
                </div>
              </div>
               )}

              {isLanBillState && (
                    <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer text-xs"
                        onClick={handlePrintBillLan}
                      >
                        Print-Bill( * )
                      </div>
                    </div>
                    )}

              {!isLanBillState && (
              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-2 py-2 rounded-md text-center bg-green-700 hover:bg-green-600 text-white font-bold cursor-pointer text-xs"
                  onClick={handlePrint}
                >
                  Duplicate-Bill
                </div>
              </div>
               )}

              {isLanBillState && (
                    <div className=" sm:w-auto mb-0 lg:mb-1 sm:mr-2 ">
                      <div
                        className="px-2 py-1.5 lg:py-2 rounded-md text-center bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer text-xs"
                        onClick={handlePrintLan}
                      >
                         Duplicate-Bill
                      </div>
                    </div>
                    )}

              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-2 py-2 rounded-md text-center bg-blue-600 text-white font-bold cursor-pointer text-xs "
                  onClick={handleSaveBill}
                >
                  Save (Pg Up)
                </div>
              </div>
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
            </div>
          </div>
          {isMobile && (
            <div className=" absolute right-0 top-0 w-80 mt-8 bg-white rounded-md">
              {/* <!-- header --> */}
              <div className="flex flex-row justify-between items-center px-5 mt-1"></div>
              <div className=" flex flex-row px-4 ml-1 lg:-mt-3 custom-scrollbars overflow-x-auto whitespace-nowrap">
                <span
                  key="all-items"
                  className={`cursor-pointer px-2 py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                    selectedCategory === null ? "bg-yellow-500 text-white" : ""
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  All Menu
                </span>
                {categories.map((category) => (
                  <span
                    key={category._id}
                    className={`whitespace-nowrap cursor-pointer px-5 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs  font-semibold ${
                      selectedCategory === category
                        ? "bg-yellow-500 text-white "
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
                <span
                  key="all-items"
                  className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                    selectedBarCategory === null
                      ? "bg-yellow-500 text-white"
                      : ""
                  }`}
                  onClick={() => handleBarCategoryClick(null)}
                >
                  All Bar Menu
                </span>

                {barCategories.map((category) => (
                  <span
                    key={category._id}
                    className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                      selectedBarCategory === category
                        ? "bg-yellow-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleBarCategoryClick(category)}
                  >
                    {category.liquorCategory}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex justify-start px-5">
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
                <div
                  className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3
              lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-1rem)]
              md:max-h-[calc(84vh-1rem)]  max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] "
                >
                  {(menus.menus || menus)
                    .filter(filterMenus) // Apply the filterMenus function
                    .map((product, index) => (
                      <div
                        key={product._id}
                        className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md
                    justify-between text-sm lg:h-32 md:h-20 "
                        onClick={() => addToOrder(product)}
                        tabIndex={0}
                        ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                        onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                      >
                        <div>
                          <div className="lg:-mt-3 -mt-1 md:-mt-2">
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
                        </div>
                        <div className="">
                          <img
                            src={
                              product.imageUrl
                                ? `http://localhost:5000/${product.imageUrl}`
                                : `/tray.png`
                            }
                            className={`object-cover rounded-md ${
                              product.imageUrl
                                ? "lg:w-24 lg:h-16 md:w-10 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:-mt-1 lg:ml-10"
                                : "lg:w-12 lg:h-10 md:w-7 md:h-7 w-8 h-8 mt-2 md:ml-7 lg:ml-12 "
                            } hidden lg:block`}
                            alt=""
                          />
                        </div>
                        <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex  justify-between">
                          <span
                            className="md:text-xs sm:text-xs lg:mb-1 flex"
                            style={{ fontSize: "11px" }}
                          >
                            {product.name}
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
                <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] cursor-pointer">
                  {/* Render prices grid here */}

                  <div className="mb-4 ml-5 lg:flex">
                    <p className="text-left font-bold">Choose Bottle to Pour</p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected childMenuId
                    >
                      {selectedBarMenuItem.childMenus
                        .filter(
                          (childMenu) =>
                            parseInt(childMenu.barCategory.replace("ml", "")) >
                            90
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
                              className="bg-gray-300 hover:bg-gray-400 p-2 rounded-md text-gray-900 text-sm"
                              onClick={() => addToOrder(childMenu)}
                            >
                              {showStockQty && (
                                <p className="text-center font-bold text-xs text-red-800 mb-1 bg-white rounded-md">
                                  <i>
                                    {stockQtyBottles} Bottles{" "}
                                    {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                  </i>
                                </p>
                              )}
                              <p className="text-center font-bold">
                                <i>{selectedBarMenuItem.name}</i>
                              </p>
                              <p className="text-center font-semibold text-white">
                                {childMenu.barCategory}
                              </p>
                              {/* Render the price dynamically */}
                              <p className="text-center font-semibold text-red-900">
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
                <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
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
                  <div className="mb-4 ml-5 lg:flex">
                    <p className="text-left font-bold mt-1">
                      Choose Bottle to Pour
                    </p>
                    <select
                      className="block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm lg:ml-4"
                      onChange={handleParentMenuSelect} // Event handler for capturing the selected parentMenuId
                    >
                      {selectedBrandMenuItem.prices
                        .filter(
                          (price) =>
                            price.price > 0 &&
                            price.barCategory.endsWith("ml") &&
                            parseFloat(price.barCategory) > 90
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
                                className="bg-gray-300 hover:bg-gray-400 p-2 rounded-md text-gray-900 text-sm"
                                onClick={() => addToOrder(price)}
                              >
                                {showStockQty && (
                                  <p className="text-center font-bold text-xs text-red-800 mb-1 bg-white rounded-md">
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
          <div className=" w-full lg:w-3/5 xl:shadow-lg md:w-96 hidden md:block bg-white mt-3">
            {/* <!-- header --> */}
            <div className=" flex flex-row px-4 -ml-1 lg:mt-1  custom-scrollbars overflow-x-auto whitespace-nowrap">
              <span
                key="all-items"
                className={`cursor-pointer px-2 py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                  selectedCategory === null ? "bg-yellow-500 text-white" : ""
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                All Menu
              </span>

              {categories.map((category) => (
                <span
                  key={category._id}
                  className={`whitespace-nowrap cursor-pointer px-5 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs  font-semibold ${
                    selectedCategory === category
                      ? "bg-yellow-500 text-white "
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className=" flex flex-row px-2 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap mt-2">
              <span
                key="all-items"
                className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${
                  selectedBarCategory === null ? "bg-yellow-500 text-white" : ""
                }`}
                onClick={() => handleBarCategoryClick(null)}
              >
                All Bar Menu
              </span>

              {barCategories.map((category) => (
                <span
                  key={category._id}
                  className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${
                    selectedBarCategory === category
                      ? "bg-yellow-500 text-white"
                      : ""
                  }`}
                  onClick={() => handleBarCategoryClick(category)}
                >
                  {category.liquorCategory}
                </span>
              ))}
            </div>

            <div className="mt-5 flex justify-start px-5 -ml-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Menu / Id..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-18 lg:w-44 md:w-44
                 text-xs -ml-4 lg:ml-0 md:ml-0 lg:text-sm md:text-sm"
              />
            </div>

            {showCategoryMenus && (
              <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-10 custom-sidescrollbars overflow-scroll lg:max-h-[calc(67vh-1rem)] md:max-h-[calc(55vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
                {(menus.menus || menus)
                  .filter(filterMenus) // Apply the filterMenus function
                  .map((product, index) => (
                    <div
                      key={product._id}
                      className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md
                    justify-between text-sm lg:h-32 md:h-20 "
                      onClick={() => addToOrder(product)}
                      tabIndex={0}
                      ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                      onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                    >
                      <div>
                        <div className="lg:-mt-3 -mt-1 md:-mt-2">
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
                      </div>
                      <div className="">
                        <img
                          src={
                            product.imageUrl
                              ? `http://localhost:5000/${product.imageUrl}`
                              : `/tray.png`
                          }
                          className={`object-cover rounded-md ${
                            product.imageUrl
                              ? "lg:w-24 lg:h-16 md:w-10 md:h-10 w-8 h-8 lg:mt-1 -mt-4 md:-mt-1 lg:ml-7"
                              : "lg:w-12 lg:h-10 md:w-7 md:h-7 w-8 h-8 mt-2 md:ml-7 lg:ml-12 "
                          } hidden lg:block`}
                          alt=""
                        />
                      </div>
                      <div className="font-bold text-gray-800 md:mt-1 sm:mt-1 lg:mt-1 lg:flex  justify-between">
                        <span
                          className="md:text-xs sm:text-xs lg:mb-1 flex"
                          style={{ fontSize: "11px" }}
                        >
                          {product.name}
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
              <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 mt-10 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
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
                                : "lg:w-16 lg:h-14 md:w-7 md:h-7 w-8 h-8 lg:mt-6 mt-2 ml-1 md:mt-4"
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

            {isPaymentModalOpen && (
              <EditPaymentModal
                onClose={() => setIsPaymentModalOpen(false)}
                orderNumber={orderNumber}
                totalAmount={calculateTotal().grandTotal}
                tableId={tableId}
                orderID={orderID}
                items={items}
              />
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
                        childMenu.pricePer[`pricePer${childMenu.barCategory}`] >
                          0
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
                            className="bg-orange-600 hover:bg-orange-500 p-2 rounded-md text-gray-900 text-sm cursor-pointer"
                            onClick={() => addToOrder(childMenu)}
                          >
                            {showStockQty && (
                              <p className="text-center font-bold text-xs text-black mb-1 bg-white rounded-md">
                                <i>
                                  {stockQtyBottles} Bottles{" "}
                                  {stockQtyMl ? `+ ${stockQtyMl} ml` : ""}
                                </i>
                              </p>
                            )}
                            <p className="text-center font-bold">
                              <i>{selectedBarMenuItem.name}</i>
                            </p>
                            <p className="text-center font-semibold text-white">
                              {childMenu.barCategory}
                            </p>
                            {/* Render the price dynamically */}
                            <p className="text-center font-semibold text-gray-900">
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
              <div className="cursor-pointer grid grid-cols-2 bg-white md:grid-cols-3 lg:grid-cols-4 gap-3 lg:px-3 md:px-2 px-2 -mt-1.5 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)]">
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
              <div className="bg-white mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(86vh-8rem)] md:max-h-[calc(84vh-1rem)] max-h-[calc(97vh-1rem)] sm:max-h-[calc(80vh-1rem)] cursor-pointer">
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
                          parseInt(price.barCategory.replace("ml", "")) >= 90 &&
                          price.stockQty > 0 // Filter condition to check if stockQty is greater than 0
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
                              className="bg-orange-600 hover:bg-orange-500 p-2 rounded-md text-gray-900 text-sm cursor-pointer"
                              onClick={() => addToOrder(price)}
                            >
                              {showStockQty && (
                                <p className="text-center font-bold text-xs text-black mb-1 bg-white rounded-md">
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
                              <p className="text-center font-semibold text-black">
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
            {/* <!-- end products --> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage;
