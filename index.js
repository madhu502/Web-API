// importing the pacakages(express)
const express = require("express");
// const mongoose = require("mongoose");

const connectDatabase = require("./database/database");
const dotenv = require("dotenv");

// Creating an express application
const app = express();

// Express JSON config
app.use(express.json());

// Connecting  to Database
connectDatabase();

// dotenv configuration
dotenv.config()

//Defining the port
const PORT = process.env.PORT;

//Making a test endpoint
// Endpoint : POST, GET, PUT, DELETE
app.get("/test", (req, res) => {
  res.send("Test api is working..");
});

// http://localhost:5000/test

// Configuring Routes of User

app.use('/api/user', require('./routes/userRoutes'))

// http://localhost5000/api/user/create

//Starting the server
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT} !`);
});
