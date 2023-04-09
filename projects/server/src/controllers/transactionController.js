const { sequelize } = require("./../models");
const db = require("../models/index");
const users = db.users;
const products = db.products;
const products_detail = db.products_detail;
const Transaction = db.transactions;
const TransactionDetail = db.transactions_detail;
const TransactionLog = db.transactions_log;
const TransactionStatus = db.transactions_status;
const cart = db.carts;
const stockHistory = db.stock_history;
const branchProducts = db.branch_products;
const branchStores = db.branch_store;
const discount = db.discounts;

const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const geolib = require("geolib");

module.exports = {
  getTransaction: async (req, res) => {
    const { sortBy, sortType, filterBy, startDate, endDate, query } = req.query;
    const token = req.headers.token;
    const decodedToken = jwt.decode(token, { complete: true });
    const id = decodedToken.payload.id;
    let findTransaction;
    try {
      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      findTransaction = await Transaction.findAll({
        include: [
          {
            model: TransactionDetail,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: TransactionStatus,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        exclude: ["createdAt", "updatedAt"],
        where: { user_id: id },
      });

      //filterby status
      if (filterBy === "date") {
        findTransaction = await Transaction.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
            },
          ],
          where: {
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
          order: [["date", "ASC"]],
        });
      } else if (filterBy === "orderStatus") {
        findTransaction = await Transactions.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
              where: {
                status_name: {
                  [Op.like]: `%${query}%`,
                },
              },
            },
          ],
          order: [["date", "DESC"]],
        });
      } else if (filterBy === "invoice") {
        findTransaction = await Transaction.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
            },
          ],
          where: {
            id: {
              [Op.like]: `%${query}%`,
            },
          },
          order: [["date", "DESC"]],
        });
      }

      //sortby
      if (sortBy === "orderID" && sortType === "asc") {
        findTransaction = await Transaction.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
            },
          ],
          order: [["id", "ASC"]],
        });
      } else if (sortBy === "orderID" && sortType === "desc") {
        findTransaction = await Transaction.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
            },
          ],
          order: [["id", "DESC"]],
        });
      } else if (sortBy === "date" && sortType === "asc") {
        findTransaction = await Transaction.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
            },
          ],
          order: [["date", "ASC"]],
        });
      } else if (sortBy === "date" && sortType === "desc") {
        findTransaction = await Transaction.findAll({
          attributes: [
            "id",
            "date",
            "expiry_date",
            "payment_proof",
            "address",
            "city",
            "state",
            "postal_code",
            "shipping",
            "total",
            "user_id",
          ],
          include: [
            {
              model: TransactionDetail,
              attributes: ["product_name", "qty", "total_price"],
            },
            {
              model: TransactionStatus,
              attributes: ["status_name"],
            },
          ],
          order: [["date", "DESC"]],
        });
      }

      if (!findTransaction) {
        res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }

      res.status(200).send({
        isError: false,
        message: "get transaction sucess",
        data: findTransaction,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: "get transaction failed",
        data: error.message,
      });
    }
  },

  addTransaction: async (req, res) => {
    const {
      address,
      city,
      state,
      zip,
      country,
      shipping,
      total,
      latitude,
      longitude,
    } = req.body;
    const t = await sequelize.transaction();

    try {
      //get token from headers
      const token = req.headers.token;
      //decode token to obtain id user
      const decodedToken = jwt.decode(token, { complete: true });
      const id = decodedToken.payload.id;

      //check user
      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      if (findUser.status === "unconfirmed") {
        res.status(400).send({
          isError: true,
          message: "please confirm your email",
          data: null,
        });
      }

      //set expired time
      const interval = 6300000; // 1.75 hours
      const currentTime = new Date();
      const expiredTime = new Date(currentTime.getTime() + interval);

      //set unique transaction id
      const transactionId = nanoid(13);
      // console.log(transactionId);

      //create transaction
      const transaction = await Transaction.create(
        {
          orderId: transactionId,
          date: new Date(),
          expiry_date: expiredTime,
          user_id: id,
          address: address,
          city: city,
          state: state,
          postal_code: zip,
          country: country,
          shipping: shipping,
          total: total,
          transaction_status_id: 1,
        },
        { transaction: t }
      );

      const cartItems = await cart.findAll({
        where: { user_id: id },
        attributes: ["id", "qty", "user_id"],
        include: [
          {
            model: products,
            attributes: ["id", "products_name"],
            include: [
              {
                model: products_detail,
                attributes: ["price"],
              },
            ],
          },
        ],
      });
      console.log(cartItems[0].dataValues.product.dataValues.id);

      const userLocation = {
        lat: latitude,
        lng: longitude,
      }

      const findStores = await branchStores.findAll({
        attributes: ["id", "branch_name", "latitude", "longitude", "city", "province", [
          sequelize.literal(`(6371 * acos(cos(radians(${userLocation.lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLocation.lng})) + sin(radians(${userLocation.lat})) * sin(radians(latitude))))`),
          'distances'
        ]],
      })
      const findClosestStore = () => {
        let closestStores;
        let secondClosestStores;

        findStores.forEach((store) => {
          if (!closestStores) {
            closestStores = store;
          } else if (!secondClosestStores) {
            secondClosestStores = store;
          } else if (store.dataValues.distances < closestStores.dataValues.distances) {
            secondClosestStores = closestStores;
            closestStores = store;
          } else if (store.dataValues.distances < secondClosestStores.dataValues.distances) {
            secondClosestStores = store;
          }
        })

        return [closestStores, secondClosestStores];
      }

      //create transaction detail
      const transactionDetails = cartItems.map((item) => {
        const product = item.dataValues.product?.dataValues;
        return {
          transaction_id: transaction.id,
          product_name: product?.products_name || "",
          qty: item.dataValues.qty,
          price: product?.products_details?.[0]?.price || 0,
        };
      });
      await TransactionDetail.bulkCreate(transactionDetails, {
        transaction: t,
      });

      //create transaction log
      await TransactionLog.create(
        {
          transaction_id: transaction.id,
          transaction_status_id: 1,
          date: new Date(),
        },
        { transaction: t }
      );

      //delete cart
      await cart.destroy({ where: { user_id: id } }, { transaction: t });

      // await t.commit();
      res.status(200).send({
        isError: false,
        message: "place order success",
        data: {findStores, closestStores: findClosestStore()},
      });
    } catch (error) {
      // await t.rollback();
      res.status(400).send({
        isError: true,
        message: "add transaction failed",
        data: error.message,
      });
    }
  },

  uploadPaymentProof: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const token = req.headers.token;
      console.log(token);
      const decodedToken = jwt.decode(token, { complete: true });
      const id = decodedToken.payload.id;

      const { transaction_id } = req.params;

      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      const findTransaction = await Transaction.findOne({
        where: [{ user_id: id }, { id: transaction_id }],
      });

      if (!findTransaction) {
        res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }
      console.log(req.files);
      if (!req.files) {
        res.status(400).send({
          isError: true,
          message: "please upload your payment proof",
          data: null,
        });
      }

      // Your payment proof file path can be stored in a variable like this:
      let paymentProofFilePath = req.files.images[0].path;
      console.log(req.files.images[0].path);

      let updatePaymentProof = await Transaction.update(
        { payment_proof: paymentProofFilePath, transaction_status_id: 2 },
        { where: [{ user_id: id }, { id: transaction_id }] },
        { transaction: t }
      );

      await TransactionLog.update(
        {
          transaction_status_id: 2,
        },
        { where: [{ transaction_id }] },
        { transaction: t }
      );

      await t.commit();
      res.status(200).send({
        isError: false,
        message: "upload payment proof success",
        data: null,
      });
    } catch (error) {
      if (t.finished !== "commit") {
        await t.rollback();
      }
      res.status(400).send({
        isError: true,
        message: "upload payment proof failed",
        data: error.message,
      });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const token = req.headers.token;
      const decodedToken = jwt.decode(token, { complete: true });
      const id = decodedToken.payload.id;

      const { transaction_id } = req.params.id;

      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      const findTransaction = await Transaction.findOne({
        where: { user_id: id },
      });

      if (!findTransaction) {
        res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }

      Transaction.update(
        {
          transaction_status_id: 6,
        },
        {
          where: { user_id: id },
        }
      );

      TransactionLog.update(
        {
          transaction_status_id: 6,
        },
        {
          where: { transaction_id: findTransaction.id },
        }
      );

      res.status(200).send({
        isError: false,
        message: "cancel order success",
        data: findTransaction,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: "cancel order failed",
        data: error.message,
      });
    }
  },

  confirmOrder: async (req, res) => {
    const token = req.params.token;
    const tokenDecode = jwt.decode(token, { complete: true });
    const id = tokenDecode.payload.id;
    const { action } = req.body;

    try {
      const findUser = await users.findOne({ where: { id } });
      if (!findUser) {
        res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      const findTransaction = await Transaction.findAll({
        where: {
          user_id: id,
        },
      });

      if (!findTransaction) {
        res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }

      const findTransactionLog = await TransactionLog.findAll({
        where: { transaction_id: findTransaction.id },
      });

      if (!findTransactionLog) {
        res.status(400).send({
          isError: true,
          message: "transaction log not found",
          data: null,
        });
      }

      Transaction.update({
        transaction_status_id: 5,
      });

      TransactionLog.update({
        transaction_status_id: 5,
      });

      res.status(200).send({
        isError: false,
        message: "confirm order success",
        data: null,
      });
    } catch (error) {}
  },
};