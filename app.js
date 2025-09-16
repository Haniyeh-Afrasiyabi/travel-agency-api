require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
let swaggerDocument = require("./swagger/swagger.json");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/static", express.static(path.join(__dirname, "public")));

// Routes
app.use(require("./routes/dev"));
app.use("/auth", require("./routes/auth"));
app.use("/tour", require("./routes/tour"));
app.use("/basket", require("./routes/basket"));
app.use("/user", require("./routes/user"));
app.use("/order", require("./routes/order"));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Tour and Travel Agency API!");
});

// Swagger setup
const PORT = process.env.PORT || 6501;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);

    swaggerDocument.servers = [
      {
        url: process.env.BASE_URL || `http://localhost:${port}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Local server",
      },
    ];

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(
      `Swagger API docs are available at ${
        process.env.BASE_URL || `http://localhost:${port}`
      }/api-docs`
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying port ${+port + 1}...`);
      startServer(+port + 1); // امتحان پورت بعدی
    } else {
      console.error("Server error:", err);
    }
  });
};

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
startServer(PORT);

//.................................

// require('dotenv').config();
// const express = require('express');

// const cors = require('cors');

// const swaggerUi = require('swagger-ui-express');
// let swaggerDocument = require('./swagger/swagger.json');
// const path = require('path');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/static', express.static(path.join(__dirname, 'public')));

// 		const PORT = process.env.PORT || 6501;
// 		const startServer = (port) => {
// 			const server = app.listen(port, async () => {
// 				console.log(`Server running on port ${port}`);
// 				swaggerDocument.servers = [
// 					{
// 						url: `http://localhost:${port}`,
// 						description: 'Local server',
// 					},
// 				];

// 				app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// 				console.log(
// 					`Swagger API docs are available at http://localhost:${port}/api-docs`
// 				);
// 				// Truncate route : http://localhost:<port>/truncate
// 			});

// 			server.on('error', (err) => {
// 				if (err.code === 'EADDRINUSE') {
// 					console.log(`Port ${port} is in use, trying port ${+port + 1}...`);
// 					startServer(+port + 1);
// 				} else {
// 					console.error('Server error:', err);
// 				}
// 			});
// 		};

// 		startServer(PORT);

// app.use(require('./routes/dev'));
// app.use('/auth', require('./routes/auth'));
// app.use('/tour', require('./routes/tour'));
// app.use('/basket', require('./routes/basket'));
// app.use('/user', require('./routes/user'));
// app.use('/order', require('./routes/order'));

// app.get('/', (req, res) => {
// 	res.send('Welcome to the Tour and Travel Agency API!');
// });
