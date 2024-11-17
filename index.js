require('dotenv').config(); // Load environment variables from .env file

const ConnectToMongodb = require("./db");
const express = require('express');
const app = express();
const passport = require('passport'); // Import Passport
const path=require('path')
var cors = require('cors');
const dbHost = process.env.DB_HOST;
const port = process.env.PORT || 8000;



// app.use(cors());
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// app.use(passport.initialize());


const corsOption = {
  origin: ["http://localhost:3000","http://localhost:3001", "https://myhotel-delta.vercel.app" , "https://s-tech.co.in"],
  methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH" , "OPTIONS" , "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length"],
  credentials: true, // Allow credentials like cookies or headers
  maxAge: 3600,
};

app.use(cors(corsOption))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

ConnectToMongodb();

app.get("/", (req, res) => {
  res.send("Hello world");
});


app.use(express.static('uploads')); // 'uploads' should be the directory where your images are stored

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/section', require('./routes/section'));
app.use('/api/table', require('./routes/table'));
app.use('/api/main', require('./routes/mainCategory'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/hotel', require('./routes/hotel'));
app.use('/api/order', require('./routes/order'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/supplier', require('./routes/supplier'));
app.use('/api/item', require('./routes/item'));
app.use('/api/gst', require('./routes/gst'));
app.use('/api/unit', require('./routes/unit'));
app.use('/api/purchase', require('./routes/purchase'));
app.use('/api/waiter', require('./routes/waiter'));
app.use('/api/stockOut', require('./routes/stockOut'));
app.use('/api/taste', require('./routes/taste'));
app.use('/api/greet', require('./routes/greet'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/logHistory', require('./routes/logHistory'));
app.use('/api/kot', require('./routes/kot'));
app.use('/api/expensesForm', require('./routes/expensesForm'));
app.use('/api/expense', require('./routes/expense'));
app.use('/api/bankName', require('./routes/bankName'));
app.use('/api/superAdmin', require('./routes/superAdmin'));
app.use('/api/liquorBrand', require('./routes/liquorBrand'));
app.use('/api/liquorCategory', require('./routes/liquorCategory'));
app.use('/api/bot', require('./routes/bot'));
app.use('/api/vat', require('./routes/vat'));
app.use('/api/barPurchase', require('./routes/barPurchase'));
app.use('/api/purchaseVAT', require('./routes/purchaseVAT'));
app.use('/api/barStockOut', require('./routes/barStockOut'));

app.use('/api/counter', require('./routes/counter'));
app.use('/api/coupon', require('./routes/coupon'));
app.use('/api/counterAdmin', require('./routes/counterAdmin'));
app.use('/api/counterLogin', require('./routes/counterLogin'));
app.use('/api/counterHotel', require('./routes/counterHotel'));
app.use('/api/counterGreet', require('./routes/counterGreet'));
app.use('/api/counterGst', require('./routes/counterGst'));

const escpos = require('escpos');
// const escposNetwork = require('escpos-network');
const net = require('net');
// const { PassThrough } = require('stream');
const jsdom = require('jsdom'); // For parsing HTML

const Printer = require('./models/Printer'); // Import the Printer model
const PrinterCoupon = require('./models/PrinterCoupon');

app.post('/print-kot', async (req, res) => {
  const { kotContent } = req.body;

  if (!kotContent) {
    return res.status(400).send('KOT content is required');
  }

  try {
    // Fetch the saved printer details from the database
    const printer = await Printer.findOne();
    console.log(printer);
    if (!printer) {
      return res.status(404).send('Printer details not found');
    }

    const client = new net.Socket();

    // Connect to the printer using the saved IP and port
    client.connect(printer.printerPort, printer.printerIP, () => {
      const escposPrinter = new escpos.Printer(client);

      // Extract the body content from HTML or plain text
      const bodyContent = extractBodyContent(kotContent);

      // Print the extracted body content
      escposPrinter
        .text(bodyContent)
        .cut()
        .close(() => {
          client.end(); // Ensure client connection is closed
          res.status(200).send('KOT printed successfully');
        });
    });

    // Handle errors with the connection
    client.on('error', (err) => {
      console.error('Network error:', err);
      client.destroy(); // Close connection on error
      res.status(500).send('Failed to connect to printer');
    });

    // Handle disconnection or error events
    client.on('close', () => {
      console.log('Connection to printer closed');
      res.status(200).send('Success');

    });

    client.on('end', () => {
      console.log('Connection ended');
    });

    // Handle any unexpected errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      client.destroy(); // Ensure the connection is closed
    });

  } catch (error) {
    console.error('Error printing KOT:', error);
    res.status(500).send('An error occurred while printing KOT');
  }
});

app.post('/print-bot', async (req, res) => {
  const { botContent } = req.body;

  if (!botContent) {
    return res.status(400).send('BOT content is required');
  }

  try {
    // Fetch the saved printer details from the database
    const printer = await Printer.findOne();
    console.log('Printer details:', printer); // Debugging log
    if (!printer) {
      return res.status(404).send('Printer details not found');
    }

    const client = new net.Socket();

    // Connect to the printer using the saved IP and port for BOT printing
    client.connect(printer.printerPortBOT, printer.printerIPBOT, () => {
      const escposPrinter = new escpos.Printer(client);

      // Extract the body content from HTML or plain text
      const bodyContent = extractBodyContent(botContent);

      // Print the extracted body content
      escposPrinter
        .text(bodyContent)
        .cut()
        .close(() => {
          client.end(); // Ensure client connection is closed
          res.status(200).send('BOT printed successfully');
        });
    });

    // Handle errors with the connection
    client.on('error', (err) => {
      console.error('Network error:', err);
      client.destroy(); // Close connection on error
      res.status(500).send('Failed to connect to printer');
    });

    // Handle disconnection or error events
    client.on('close', () => {
      console.log('Connection to printer closed');
      res.status(200).send('Success ');

    });

    client.on('end', () => {
      console.log('Connection ended');
      
    });

    // Handle any unexpected errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      client.destroy(); // Ensure the connection is closed
    });

  } catch (error) {
    console.error('Error printing BOT:', error);
    res.status(500).send('An error occurred while printing BOT');
  }
});

app.post('/print-bill', async (req, res) => { 
  const { billContent } = req.body;

  // Validate the bill content
  if (!billContent) {
    return res.status(400).send('Bill content is required');
  }

  try {
    // Fetch the saved printer details from the database
    const printer = await Printer.findOne();
    console.log('Printer details:', printer); // Debugging log
    if (!printer) {
      return res.status(404).send('Printer details not found');
    }

    const client = new net.Socket();

    // Connect to the printer using the saved IP and port for bill printing
    client.connect(printer.printerPortBill, printer.printerIPBill, () => {
      const escposPrinter = new escpos.Printer(client);

      // Extract the body content from HTML or plain text
      const bodyContent = extractBodyContent(billContent);

      // Print the extracted body content
      escposPrinter
        .text(bodyContent) // Print the text content of the bill
        .cut()             // Cut the paper after printing
        .close(() => {
          client.end(); // Ensure client connection is closed after printing
          res.status(200).send('Bill printed successfully');
        });
    });

    // Handle errors with the connection
    client.on('error', (err) => {
      console.error('Network error:', err);
      client.destroy(); // Close connection on error
      res.status(500).send('Failed to connect to printer');
    });

    // Handle disconnection or error events
    client.on('close', () => {
      console.log('Connection to printer closed');
      res.status(200).send('BOT printed successfully');
    });

    client.on('end', () => {
      console.log('Connection ended');
    });

    // Handle any unexpected errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      client.destroy(); // Ensure the connection is closed
    });

  } catch (error) {
    console.error('Error printing Bill:', error);
    res.status(500).send('An error occurred while printing Bill');
  }
});

app.post('/print-report', async (req, res) => {
  const { reportContent } = req.body;

  // Validate the report content
  if (!reportContent) {
    return res.status(400).send('Report content is required');
  }

  try {
    // Fetch the saved printer details from the database
    const printer = await Printer.findOne();
    console.log('Printer details:', printer); // Debugging log
    if (!printer) {
      return res.status(404).send('Printer details not found');
    }

    const client = new net.Socket();

    // Connect to the printer using the saved IP and port for bill printing
    client.connect(printer.printerPortBill, printer.printerIPBill, () => {
      const escposPrinter = new escpos.Printer(client);

      // Extract the body content from HTML or plain text for the report
      const bodyContent = extractBodyContent(reportContent);

      // Print the extracted report content
      escposPrinter
        .text(bodyContent) // Print the text content of the report
        .cut()             // Cut the paper after printing
        .close(() => {
          client.end(); // Ensure client connection is closed after printing
          res.status(200).send('Report printed successfully');
        });
    });

    // Handle errors with the connection
    client.on('error', (err) => {
      console.error('Network error:', err);
      client.destroy(); // Close connection on error
      res.status(500).send('Failed to connect to printer');
    });

    // Handle disconnection or error events
    client.on('close', () => {
      console.log('Connection to printer closed');
      res.status(200).send('Report printed successfully');
    });

    client.on('end', () => {
      console.log('Connection ended');
    });

    // Handle any unexpected errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      client.destroy(); // Ensure the connection is closed
    });

  } catch (error) {
    console.error('Error printing Report:', error);
    res.status(500).send('An error occurred while printing Report');
  }
});

app.post('/print-coupon', async (req, res) => {
  const { couponContent } = req.body; // Accept coupon content with embedded counter changes

  if (!couponContent) {
    return res.status(400).send('Coupon content is required');
  }

  try {
    // Fetch the saved printer details from the database
    const printer = await PrinterCoupon.findOne();
    if (!printer) {
      return res.status(404).send('Printer details not found');
    }

    // Extract printer IP and port specifically for coupons
    const printerIPCoupon = printer.printerIPCoupon;
    const printerPortCoupon = printer.printerPortCoupon;

    const client = new net.Socket();

    // Connect to the printer using the saved IP and port for coupon printing
    client.connect(printerPortCoupon, printerIPCoupon, () => {
      const escposPrinter = new escpos.Printer(client);

      // Extract body content from HTML (similar to KOT)
      const bodyContent = extractBodyContent(couponContent);

      // Split content into lines by newlines or other delimiter
      const lines = bodyContent.split('\n');

      let firstCounterEncountered = false; // Track if the first counter has been encountered

      lines.forEach((line, index) => {
        // Check if the line contains the word 'counter' with optional numbers before/after, case insensitive
        if (/counter\d*/i.test(line)) {
          // Cut the page only if this is not the first counter encounter
          if (firstCounterEncountered) {
            escposPrinter.cut();
          } else {
            // Set the flag after encountering the first counter
            firstCounterEncountered = true;
          }
        }

        // Print the line after handling cutting logic
        escposPrinter.text(line);

        // If it's the last line, cut the page to finish the print job
        if (index === lines.length - 1) {
          escposPrinter.cut();
        }
      });

      // Close the printer connection after printing
      escposPrinter.close(() => {
        client.end();
        res.status(200).send('Coupon printed successfully');
      });
    });

    // Handle errors with the connection
    client.on('error', (err) => {
      console.error('Network error:', err);
      client.destroy(); // Close connection on error
      res.status(500).send('Failed to connect to printer');
    });

    // Handle disconnection or error events
    client.on('close', () => {
      console.log('Connection to printer closed');
      res.status(200).send('Coupon printed successfully');
    });
    client.on('end', () => {
      console.log('Connection ended');
    });

    // Handle any unexpected errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      client.destroy(); // Ensure the connection is closed
    });

  } catch (error) {
    console.error('Error printing Coupon:', error);
    res.status(500).send('An error occurred while printing the Coupon');
  }
});

// app.post('/print-coupon', async (req, res) => {
//   const { couponContent } = req.body; // Accept coupon content with embedded counter changes

//   if (!couponContent) {
//     return res.status(400).send('Coupon content is required');
//   }

//   try {
//     // Fetch the saved printer details from the database
//     const printer = await PrinterCoupon.findOne();
//     if (!printer) {
//       return res.status(404).send('Printer details not found');
//     }

//     // Extract printer IP and port specifically for coupons
//     const printerIPCoupon = printer.printerIPCoupon;
//     const printerPortCoupon = printer.printerPortCoupon;

//     const client = new net.Socket();

//     // Connect to the printer using the saved IP and port for coupon printing
//     client.connect(printerPortCoupon, printerIPCoupon, () => {
//       const escposPrinter = new escpos.Printer(client);

//       // Extract body content from HTML (similar to KOT)
//       const bodyContent = extractBodyContent(couponContent);

//       // Split content into lines by newlines or other delimiter
//       const lines = bodyContent.split('\n');

//       let firstCounterEncountered = false; // Track if the first counter has been encountered

//       lines.forEach((line, index) => {
//         // Check if the line contains the word 'counter' with optional numbers before/after, case insensitive
//         if (/counter\d*/i.test(line)) {
//           // Only cut if this is not the first "counter" encounter
//           if (firstCounterEncountered) {
//             escposPrinter.cut();
//           } else {
//             // Set the flag after encountering the first "counter"
//             firstCounterEncountered = true;
//           }
//         }

//         // Print the line after handling cutting logic
//         escposPrinter.text(line);

//         // If it's the last line, cut the page to finish the print job
//         if (index === lines.length - 1) {
//           escposPrinter.cut();
//         }
//       });

//       // Close the printer connection after printing
//       escposPrinter.close(() => {
//         client.end();
//         res.status(200).send('Coupon printed successfully');
//       });
//     });

//     // Handle errors with the connection
//     client.on('error', (err) => {
//       console.error('Network error:', err);
//       client.destroy(); // Close connection on error
//       res.status(500).send('Failed to connect to printer');
//     });

//     // Handle disconnection or error events
//     client.on('close', () => {
//       console.log('Connection to printer closed');
//     });
//     client.on('end', () => {
//       console.log('Connection ended');
//     });

//     // Handle any unexpected errors
//     process.on('uncaughtException', (err) => {
//       console.error('Uncaught Exception:', err);
//       client.destroy(); // Ensure the connection is closed
//     });

//   } catch (error) {
//     console.error('Error printing Coupon:', error);
//     res.status(500).send('An error occurred while printing the Coupon');
//   }
// });

// app.post('/print-coupon', async (req, res) => {
//   const { couponContent } = req.body; // Accept coupon content with embedded counter changes

//   if (!couponContent) {
//     return res.status(400).send('Coupon content is required');
//   }

//   try {
//     // Fetch the saved printer details from the database
//     const printer = await PrinterCoupon.findOne();
//     if (!printer) {
//       return res.status(404).send('Printer details not found');
//     }

//     // Extract printer IP and port specifically for coupons
//     const printerIPCoupon = printer.printerIPCoupon;
//     const printerPortCoupon = printer.printerPortCoupon;

//     const client = new net.Socket();

//     // Connect to the printer using the saved IP and port for coupon printing
//     client.connect(printerPortCoupon, printerIPCoupon, () => {
//       const escposPrinter = new escpos.Printer(client);

//       // Extract body content from HTML (similar to KOT)
//       const bodyContent = extractBodyContent(couponContent);

//       // Split content into lines by newlines or other delimiter
//       const lines = bodyContent.split('\n');

//       let firstCounterEncountered = false; // Track if the first counter with a number has been encountered

//       lines.forEach((line, index) => {
//         // Check if the line contains 'counter' followed by a number, case insensitive
//         if (/counter\d+/i.test(line)) {
//           // Only cut if this is not the first "counter" with a number encountered
//           if (firstCounterEncountered) {
//             escposPrinter.cut();
//           } else {
//             // Set the flag after encountering the first "counter" with a number
//             firstCounterEncountered = true;
//           }
//         }

//         // Print the line after handling cutting logic
//         escposPrinter.text(line);

//         // If it's the last line, cut the page to finish the print job
//         if (index === lines.length - 1) {
//           escposPrinter.cut();
//         }
//       });

//       // Close the printer connection after printing
//       escposPrinter.close(() => {
//         client.end();
//         res.status(200).send('Coupon printed successfully');
//       });
//     });

//     // Handle errors with the connection
//     client.on('error', (err) => {
//       console.error('Network error:', err);
//       client.destroy(); // Close connection on error
//       res.status(500).send('Failed to connect to printer');
//     });

//     // Handle disconnection or error events
//     client.on('close', () => {
//       console.log('Connection to printer closed');
//     });
//     client.on('end', () => {
//       console.log('Connection ended');
//     });

//     // Handle any unexpected errors
//     process.on('uncaughtException', (err) => {
//       console.error('Uncaught Exception:', err);
//       client.destroy(); // Ensure the connection is closed
//     });

//   } catch (error) {
//     console.error('Error printing Coupon:', error);
//     res.status(500).send('An error occurred while printing the Coupon');
//   }
// });

// POST API to save printer data
app.post('/printer', async (req, res) => {
  const { printerIP, printerPort, printerIPBOT, printerPortBOT, printerIPBill, printerPortBill } = req.body;

  // Validate required fields
  if (!printerIP || !printerPort ) {
    return res.status(400).json({ error: 'All printer IPs and ports are required' });
  }

  try {
    // Create a new Printer document using the provided data
    const newPrinter = new Printer({
      printerIP,
      printerPort,
      printerIPBOT,
      printerPortBOT,
      printerIPBill,
      printerPortBill
    });

    // Save the new printer details to the database
    await newPrinter.save();

    res.status(201).json({ message: 'Printer data saved successfully', printer: newPrinter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save printer data', details: error.message });
  }
});

// DELETE API to delete a printer by a specific IP
app.delete('/printers', async (req, res) => {
  const { printerIP, printerIPBOT, printerIPBill } = req.body; // The IP address to delete

  try {
    // Create a query object to search for the provided IP address
    let query = {};
    if (printerIP) query.printerIP = printerIP;
    if (printerIPBOT) query.printerIPBOT = printerIPBOT;
    if (printerIPBill) query.printerIPBill = printerIPBill;

    // Check if at least one IP is provided
    if (Object.keys(query).length === 0) {
      return res.status(400).json({ message: 'No IP address provided to delete' });
    }

    // Find and delete the printer by the provided IP address
    const deletedPrinter = await Printer.findOneAndDelete(query);

    // If no printer is found, return a 404 error
    if (!deletedPrinter) {
      return res.status(404).json({ message: 'No printer found with the provided IP address' });
    }

    // Return a success message with the deleted printer details
    res.status(200).json({ message: 'Printer deleted successfully', deletedPrinter });
  } catch (error) {
    console.error('Error deleting printer:', error);
    res.status(500).json({ message: 'An error occurred while deleting the printer', error: error.message });
  }
});

// GET API to retrieve printer details
app.get('/printerall', async (req, res) => {
  try {
    // Fetch the printer details from the database
    const printer = await Printer.findOne();
    
    if (!printer) {
      return res.status(404).json({ message: 'No printer details found' });
    }

    // Return the printer details
    res.status(200).json(printer);
  } catch (error) {
    console.error('Error fetching printer details:', error);
    res.status(500).json({ message: 'An error occurred while fetching printer details', error: error.message });
  }
});

// POST API to save printer data
app.post('/printerCoupon', async (req, res) => {
  const { printerIPCoupon, printerPortCoupon } = req.body;

  // Validate required fields
  if (!printerIPCoupon || !printerPortCoupon ) {
    return res.status(400).json({ error: 'All printer IPs and ports are required' });
  }

  try {
    // Create a new Printer document using the provided data
    const newPrinter = new PrinterCoupon({
      printerIPCoupon,
      printerPortCoupon,
    });

    // Save the new printer details to the database
    await newPrinter.save();

    res.status(201).json({ message: 'Printer data saved successfully', printer: newPrinter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save printer data', details: error.message });
  }
});

// GET API to retrieve printer details
app.get('/couponPrinter', async (req, res) => {
  try {
    // Fetch the printer details from the database
    const printer = await PrinterCoupon.findOne();
    
    if (!printer) {
      return res.status(404).json({ message: 'No printer details found' });
    }

    // Return the printer details
    res.status(200).json(printer);
  } catch (error) {
    console.error('Error fetching printer details:', error);
    res.status(500).json({ message: 'An error occurred while fetching printer details', error: error.message });
  }
});

// Function to extract body content from HTML
const extractBodyContent = (htmlContent) => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(htmlContent);
  const bodyContent = dom.window.document.body.textContent || "";
  return bodyContent.trim();
};


app.listen(port, '0.0.0.0', () => {
  console.log(`MyHotel listening at http://localhost:${port}`);
});


