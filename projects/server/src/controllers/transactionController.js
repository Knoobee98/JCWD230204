const { sequelize } = require("./../models");
const { Op } = require("sequelize"); 
const db = require("../models/index");
const users = db.users;
const products = db.products;
const products_detail = db.products_detail;
const Transaction = db.transactions;
const TransactionDetail = db.transactions_details;
const TransactionLog = db.transactions_log;
const TransactionStatus = db.transactions_status;
const cart = db.carts;
const stockHistory = db.stock_history;
const branchProducts = db.branch_products;
const branchStores = db.branch_store;
const discount = db.discounts;

const { nanoid } = require("nanoid");
const geolib = require("geolib");
const path = require("path");

module.exports = {
  getTransaction: async (req, res) => {
    const { sortBy, sortType, filterBy, startDate, endDate, query } = req.query;
    const id = req.uid.id;
    let findTransaction;
    try {
      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        return res.status(400).send({
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
            user_id: id
          },
          order: [["date", "ASC"]],
        });
      } else if (filterBy === "orderStatus") {
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
              where: {
                status_name: {
                  [Op.like]: `%${query}%`,
                },
              },
            },
          ],
          where: {
            user_id: id
          },
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
            user_id: id
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
          where: {
            user_id: id
          },
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
          where: {
            user_id: id
          },
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
          where: {user_id: id},
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
          where: {user_id: id},
          order: [["date", "DESC"]],
        });
      }

      if (!findTransaction) {
        return res.status(400).send({
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
      const id = req.uid.id;

      //check user
      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        return res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      if (findUser.status === "unconfirmed") {
        return res.status(400).send({
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

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        await t.rollback();
        return res.status(400).send({
          isError: true,
          message: "invalid location",
          data: null,
        });
      }

      const userLocation = {
        lat,
        lng,
      }

      //get branchStores
      const findStores = await branchStores.findAll({
        attributes: ["id", "branch_name", "latitude", "longitude", "city", "province", [
          sequelize.literal(`(6371 * acos(cos(radians(${userLocation.lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLocation.lng})) + sin(radians(${userLocation.lat})) * sin(radians(latitude))))`),
          'distances'
        ]],
        include: {
          model: branchProducts,
          attributes: ["id", "product_id", "stock"],
          include: {
            model: products,
            attributes: ["products_name"],
          },
        },

        order: [[sequelize.col('distances'), 'ASC']],
        limit: 3
      });

      let transaction;

      if(findStores.length > 0){
        const storeId = findStores[0].dataValues.id;

        console.log(id, storeId)

        //get cart
        const cartItems = await cart.findAll({
            where: {
                user_id: id
            },
            include: [
                {
                    model: products,
                    attributes: ['id', 'products_name'],
                    include: [{model: discount},
                    {model: products_detail,
                    attributes: ['price']} ],
                    exclude: ['createdAt', 'updatedAt']
                }
            ],
            exclude: ['createdAt', 'updatedAt']
        })

        console.log(cartItems)

        for (const cartItem of cartItems) {
          // console.log(cartItem)
          const product = await branchProducts.findOne({
            where: { product_id: cartItem.product.id, branch_id: storeId },
          })

          if(product){
            const newStock = product.stock - cartItem.qty;
            const previousStock = product.stock;

            await product.update({ stock: newStock }, { transaction: t });

            const stockhistory = await stockHistory.create({
              event_type: "purchase",
              event_date: new Date(),
              quantity_changed: cartItem.qty,
              remaining_quantity: newStock,
              product_id: cartItem.product.id,
            }, { transaction: t });
          }
        }

        //create transaction
        transaction = await Transaction.create({
          date: new Date(),
          expiry_date: expiredTime,
          address,
          city,
          state,
          postal_code: zip,
          country,
          shipping,
          total,
          user_id: id,
          transaction_status_id: 1,
          orderId: transactionId
        }, { transaction: t });

        // Create TransactionLog for the entire transaction
        const transactionLog = await TransactionLog.create({
          transaction_id: transaction.id,
          datetime: new Date(),
          transaction_status_id: 1,
        }, { transaction: t });

        // Create TransactionDetail for each item in the cart
        for (const cartItem of cartItems) {
          const transactionDetail = await TransactionDetail.create({
            product_name: cartItem.dataValues.product.dataValues.products_name,
            qty: cartItem.qty,
            total_price: cartItem.dataValues.product.dataValues.products_details[0].dataValues.price * cartItem.qty,
            transaction_id: transaction.id
          }, { transaction: t });
        }

        console.log('Stock updated and StockHistory created for closest store:', findStores[0].dataValues.branch_name);
        console.log('TransactionLog and TransactionDetails created for the entire transaction');

      } else {
        await t.rollback();
        return res.status(400).send({
          isError: true,
          message: "no store found near your location",
          data: null,
        });
      }

      //delete cart
      await cart.destroy({ where: { user_id: id } }, { transaction: t });

      await t.commit();
      res.status(200).send({
        isError: false,
        message: "place order success",
        data: { id: transaction.id },
      });

    } catch (error) {
      if (t.finished !== "commit") {
        await t.rollback();
      }
      console.error("addTransaction error:", error);
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
      const id = req.uid.id;

      const { transaction_id } = req.params;

      if (!transaction_id) {
        return res.status(400).send({
          isError: true,
          message: "transaction id is required",
          data: null,
        });
      }

      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        return res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      const findTransaction = await Transaction.findOne({
        where: { user_id: id, id: transaction_id },
      });

      if (!findTransaction) {
        return res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }
      if (!req.files || !req.files.images || !req.files.images.length) {
        return res.status(400).send({
          isError: true,
          message: "please upload your payment proof",
          data: null,
        });
      }

      // Your payment proof file path can be stored in a variable like this:
      let paymentProofFilePath = `Public/images/${req.files.images[0].filename}`;

      let updatePaymentProof = await Transaction.update(
        { payment_proof: paymentProofFilePath, transaction_status_id: 2 },
        { where: { user_id: id, id: transaction_id }, transaction: t }
      );

      await TransactionLog.update(
        {
          transaction_status_id: 2,
        },
        { where: { transaction_id }, transaction: t }
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
      const id = req.uid.id;

      const { id: transaction_id } = req.query;

      if (!transaction_id) {
        return res.status(400).send({
          isError: true,
          message: "transaction id is required",
          data: null,
        });
      }

      const findUser = await users.findOne({
        where: { id },
      });

      if (!findUser) {
        return res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      const findTransaction = await Transaction.findOne({
        where: { user_id: id, id: transaction_id },
      });

      if (!findTransaction) {
        return res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }

      await Transaction.update(
        {
          transaction_status_id: 6,
        },
        {
          where: { user_id: id, id: transaction_id },
        }
      );

      await TransactionLog.update(
        {
          transaction_status_id: 6,
        },
        {
          where: { transaction_id },
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
    const id = req.uid.id;
    const { id: transaction_id } = req.query;

    try {
      if (!transaction_id) {
        return res.status(400).send({
          isError: true,
          message: "transaction id is required",
          data: null,
        });
      }

      const findUser = await users.findOne({ where: { id } });
      if (!findUser) {
        return res.status(400).send({
          isError: true,
          message: "user not found",
          data: null,
        });
      }

      const findTransaction = await Transaction.findOne({
        where: {
          user_id: id,
          id: transaction_id,
        },
      });

      if (!findTransaction) {
        return res.status(400).send({
          isError: true,
          message: "transaction not found",
          data: null,
        });
      }

      await Transaction.update(
        {
          transaction_status_id: 5,
        },
        {
          where: { user_id: id, id: transaction_id },
        }
      );

      await TransactionLog.update(
        {
          transaction_status_id: 5,
        },
        {
          where: { transaction_id },
        }
      );

      res.status(200).send({
        isError: false,
        message: "confirm order success",
        data: null,
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: "confirm order failed",
        data: error.message,
      });
    }
  },
};
