// import Sequelize
const {sequelize} = require('./../models');

// to generate uuid
const { v4: uuidv4 } = require('uuid')

// import model
const db = require('./../models/index');
const users = db.users;
const admin = db.admin;
const products = db.products;
const productsDetail = db.products_detail;
const productsImage = db.products_image;
const categoryProducts = db.category;
const branchProducts = db.branch_products;
const stockHistory = db.stock_history;
const transaction = db.transactions;
const discount = db.discounts;

// import hash
const {hashPassword, hashMatch} = require('./../lib/hash')
// import jwtoken
const {createToken} = require('../lib/jwtoken')

const transporter = require('./../helpers/transport');
const fs = require('fs').promises
const handlebars = require('handlebars');


module.exports = {
    loginsuperadmin: async(req, res) => {
        try {
            // step 1: ambil data dari req.body
            const { email, password, } = req.body

            // step 2: validasi
            if(!email.length || !password.length)
            return res.status(404).send({
                isError: true,
                message: 'Input is required',
                data: null
            })
        
            // step 3: check ke database, username & email nya exist
            let findEmail= await admin.findOne({
                where: {
                        email: email
                }
            })
            if(!findEmail)
                return res.status(404).send({
                    isError: true,
                    message: 'email not exist',
                    data: null
                })

            // step 4: check password
            if(password !== findEmail.password){
                return res.status(404).send({
                    isError: true,
                    message: 'password is wrong',
                    data: null
                })
            }

            // step 5 : token            
            let token = createToken({
                id: findEmail.dataValues.id,
                username: findEmail.dataValues.username,
                status: findEmail.dataValues.status,
            });

            // step 6 : kirim response
            res.status(201).send({
                isError: false, 
                message: 'Login Success', 
                data: token
            })

        } catch (error) {
            res.status(404).send({
                isError: true, 
                message: "Login Failed", 
                data: error
            })
        }
    },

    registerbranchadmin: async(req, res) => {
        try {
            let {email, password} = req.body;

            if(!email.length || !password.length)
                res.status(404).send({
                    isError: true,
                    message: "Input must be filled",
                    data: null,
                })

            let findEmail = await admin.findOne({
                where: { 
                    email:email
                }
            });

            if(findEmail) 
                res.status(404).send({
                isError: true, 
                message: 'Email already exist', 
                data: null
            });

            res.status(200).send({
                isError: false, 
                message: 'Register Success', 
                data: {token}
                });
        } catch (error) {
            res.status(404).send({
				isError: true,
				message: "Register Failed",
				data: error.message,
			});   
        }
    },

    getTransactionUser: async(req, res) => {
        try {
            const findTransaction = await db.transactions.findAll({
                attributes: ['id', 'date', 'expiry_date', 'payment_proof', 'user_id'],
                include: [{
                    model: db.transactions_status,
                    attributes: ['status_name']
                }]
            })

            res.status(200).send({
                isError: false,
                message: "Get Transaction Success",
                data: findTransaction,
            })

        } catch (error) {
            
            res.status(400).send({
                isError: true,
                message: "Get Transaction Failed",
                data: error.message,
            })
        }

    },

    updateTransactionStatus: async(req, res) => {
        const {transactionStatus} = req.body;
        const {transactionId} = req.params;

        try {
            
            const findTransactionStatus = await transaction.findAll({
                where: {
                    id: transactionId
                }
            })

            if(!findTransactionStatus){
                res.status(404).send({
                    isError: true,
                    message: "Transaction Not Found",
                    data: null,
                })
            }

            if(transactionStatus === "Confirm Payment"){
                const updateTransactionStatus = await transaction.update({
                    transaction_status_id: 3,
                })
            } else if(transactionStatus === "delivery"){
                const updateTransactionStatus = await transaction.update({
                    transaction_status_id: 4,
                })
            } else if(transactionStatus === "cancel"){
                const updateTransactionStatus = await transaction.update({
                    transaction_status_id: 6,
                })
            }

            res.status(200).send({
                isError: false,
                message: "Update Transaction Status Success",
                data: null,
            })
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "Update Transaction Status Failed",
                data: error.message,
            })
        }
    },

    getAllProducts: async(req, res) => {
        try {
            const findProducts = await products.findAll({
                attributes: ['id', 'products_name'],
                include: [
                    {
                        model: productsDetail,
                        attributes: ['desc', 'price']
                    },
                    {
                        model: productsImage,
                        attributes: ['image']
                    },
                    {
                        model: categoryProducts,
                        attributes: ['category_name']
                    },
                    {
                        model: branchProducts,
                        attributes: ['stock']
                    }
                ]
            })

            res.status(200).send({
                isError: false,
                message: "Get All Products Success",
                data: findProducts,
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "Get All Products Failed",
                data: error.message,
            })
        }
    },

    getBranchProducts: async(req, res) => {
        const id = req.params.id;
        try {
            // const findAdmin = await admin.findOne({
            //     where: {
            //         id
            //     }
            // })

            // if(!findAdmin) {
            //     res.status(404).send({
            //         isError: true,
            //         message: "Admin Not Found",
            //         data: null,
            //     })
            // }

            // if(findAdmin.status !== "branch admin"){
            //     res.status(404).send({
            //         isError: true,
            //         message: "You are not branch admin",
            //         data: null,
            //     })
            // }

            const findBranchProducts = await products.findAll({
                attributes: ['id', 'products_name'],
                include: [
                    {
                        model: productsDetail,
                        attributes: ['desc', 'price']
                    },
                    {
                        model: productsImage,
                        attributes: ['url']
                    },
                    {
                        model: branchProducts,
                        attributes: ['stock'],
                    }
                ]
            })

            res.status(200).send({
                isError: false,
                message: "Get Branch Products Success",
                data: findBranchProducts,
            })

            
        } catch(error) {
            res.status(400).send({
                isError: true,
                message: "Get Branch Products Failed",
                data: error.message,
            })
        }
    },
 
    createProduct: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const { product_name, product_desc, product_category, product_price, product_stock, branch_id } = req.body;
            //get admin id
            const {admin_id} = req.params.admin_id;

            const createProductCategory = await categoryProducts.create({
                category: product_category,
            }, {transaction: t})

            const createProduct = await products.create({
                product_name: product_name,
                category_id: createProductCategory.id,
            }, {transaction: t})

            const createProductDetail = await productsDetail.create({
                product_id: createProduct.id,
                product_price: product_price,
                product_desc: product_desc,
            }, {transaction: t})

            const createProductStock = await branchProducts.create({
                stock: product_stock,
                branch_id: branch_id,
                product_id: createProduct.id,
            }, {transaction: t})

            //createProductImage

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Create Product Success",
                data: null,
            })
            
        } catch (error) {

            await t.rollback()
            res.status(404).send({
                isError: true,
                message: "Create Product Failed",
                data: error.message,
            })
        }
    },

    uploadProductImage: async(req, res) => {
        const t = await sequelize.transaction()
        const {admin_id} = req.params
        const {product_id} = req.body
        try {
            const findAdmin = await admin.findOne({
                where: [
                    {id: admin_id},
                    {status: "branch admin"}
                ]
            })

            if(!findAdmin){
                res.status(404).send({
                    isError: true,
                    message: "Admin Not Found",
                    data: null,
                })
            }

            const findProduct = await products.findAll({
                where: {
                    id: product_id
                }
            })

            if(!findProduct){
                res.status(404).send({
                    isError: true,
                    message: "Product Not Found",
                    data: null,
                })
            }

            if(!req.files){
                res.status(404).send({
                    isError: true,
                    message: "Image Not Found",
                    data: null,
                })
            }
            console.log(req.files)
            const productImagePath = req.files.images[0].path
            console.log(productImagePath)

            const uploadProductImage = await productsImage.update({
                url: productImagePath,
            }, {
                where: {
                    product_id: product_id
                }
            }, {transaction: t})

            await t.commit()
            res.status(200).send({
                isError: false,
                message: "Upload Product Image Success",
                data: null,
            })

        } catch (error) {
            await t.rollback()
            res.status(400).send({
                isError: true,
                message: "Upload Product Image Failed",
                data: error.message,
            })
        }

    },

    updateProduct: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const {product_id, product_name, product_category, product_price, product_desc, product_stock} = req.body;
            //get admin id
            const {admin_id} = req.params.admin_id;

            const findProduct = await products.findOne({
                where: {
                    id: product_id
                }
            })

            if(!findProduct){
                res.status(404).send({
                    isError: true,
                    message: "Product not found",
                    data: null,
                })
            }

            const updateProduct = await products.update({
                product_name: product_name,
            }, {
                where: {
                    id: product_id,
                }
            }, {transaction: t})

            const updateProductCategory = await categoryProducts.update({
                category: product_category
            }, {
                where: {
                    id: updateProduct.category_id
                }
            }, {transaction: t})

            const updateProductDetail = await productsDetail.update({
                price: product_price,
                desc: product_desc,
            }, {
                where: {
                    product_id: product_id,
                }
            }, {transaction: t})

            //update product images

            const updateProductStock = await branchProducts.update({
                stock: product_stock
            }, {
                where: {
                    product_id: product_id,
                }
            }, {transaction: t})

            const stockRemaining = updateProductStock.stock - product_stock

            const updateStockHistory = await stockHistory.create({
                product_id: product_id,
                event_type: 'admin change stock',
                event_date: new Date(),
                quantity_changed: product_stock,
                quantity_remaining: stockRemaining,
            }, {transaction: t})

            await t.commit();

            res.status(200).send({
                isError: false,
                message: "Update Success",
                data: null,
            })

        } catch (error) {
            
            await t.rollback();
            res.status(404).send({
                isError: true,
                message: "Update Failed",
                data: error.message,
            })
        }
    },

    deleteProduct: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const {product_id} = req.body;

            const findProduct = await products.findAll({
                where: {
                    id: product_id
                }
            })

            if(!findProduct){
                res.status(404).send({
                    isError: true,
                    message: "Product not found",
                    data: null,
                })
            }

            const deleteProduct = await products.destroy({
                where: { product_id },
                cascade: true,
                transaction: t
            })

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Delete Success",
                data: null,
            })

            
        } catch (error) {

            await t.rollback()
            res.status(404).send({
                isError: true,
                message: "Delete Failed",
                data: error.message,
            })
        }
    },

    getStockHistory: async(req, res) => {
        try {
            const {product_id} = req.body;

            const findStockHistory = await stockHistory.findAll({
                where: {
                    product_id: product_id
                }
            })

            res.status(200).send({
                isError: false,
                message: "Get Stock History Success",
                data: findStockHistory,
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "Get Stock History Failed",
                data: error.message,
            })
        }
    },

    createDiscount: async(req, res) => {
        const t = await sequelize.transaction()
        const {discount_name, discount_type, discount_value, product_id, days} = req.body;
        const {admin_id} = req.params
        try{

            const findAdmin = await admin.findByPk(admin_id)
            if(!findAdmin){
                res.status(404).send({
                    isError: true,
                    message: "Admin not found",
                    data: null,
                })
            }
            const today = new Date()
            const expiry_date = new Date(today.setDate(today.getDate() + days))
            const productIds = product_id
            const discounts = []

            for(const product_id of productIds){
                const newDiscount = {
                    name: discount_name,
                    type: discount_type,
                    voucher_value: discount_value,
                    expiry_date: expiry_date,
                    admin_id: admin_id,
                    product_id: product_id
                };

                discounts.push(newDiscount)
            }

            console.log(discounts)

            const createDiscount = await discount.bulkCreate(discounts, {transaction: t});

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Create Discount Success",
                data: createDiscount,
            })

        } catch(error){

            await t.rollback()
            res.status(400).send({
                isError: true,
                message: "Create Discount Failed",
                data: error.message,
            })

        }
    },
};


