require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const path = require("path");

const PORT = process.env.PORT || 8000;
const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ||
    'http://localhost:3000,https://jcwd230204.purwadhikabootcamp.com,https://jcwd-230204-client.vercel.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/Public', express.static(path.join(__dirname, '/Public')))

//#region API ROUTES
const {adminRouter, productsRouter, usersRouter, transactionRouter, rajaOngkirAPIRouter, openCageRouter} = require('./routers');
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/rajaOngkir', rajaOngkirAPIRouter);
app.use('/api/openCage', openCageRouter)

// NOTE : Add your routes here

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
    res.status(404).send({
      isError: true,
      message: "Not found !",
      data: null,
    });
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(err.status || 500).send({
      isError: true,
      message: err.message || "Internal Server Error",
      data: err.data || null,
    });
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

if (require.main === module) {
  app.listen(PORT, (err) => {
    if (err) {
      console.log(`ERROR: ${err}`);
    } else {
      console.log(`APP RUNNING at ${PORT} ✅`);
    }
  });
}

module.exports = app;

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
