require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const path = require("path");

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/Public', express.static('Public'))

//#region API ROUTES
const {adminRouter, productsRouter, usersRouter, transactionRouter, rajaOngkirAPIRouter, openCageRouter} = require('./routers');
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/rajaOngkir', rajaOngkirAPIRouter);
app.use('/api/openCage', openCageRouter)

// NOTE : Add your routes here

app.use('/Public', express.static(path.join(__dirname, '/Public')))

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

// sequelize synchronous
// const Sequelize = require('sequelize')
// const Models = require('./models')

// Models.sequelize.sync({
//     force: false,
//     alter: true,
//     logging: console.log
// }).then(function () {
//     console.log('database is synchronized')
// }).catch(function (error){
//     console.log(error, 'something went wrong with the database')
// })
