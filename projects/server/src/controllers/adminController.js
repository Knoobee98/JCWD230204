// import Sequelize
const {sequelize} = require('./../models');
const path = require("path");

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
const profiles = db.profiles;
const settings = db.settings;

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
            if(!email || !password)
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
            const storedPassword = findEmail.password;
            const passwordMatch = storedPassword.startsWith('$2')
                ? await hashMatch(password, storedPassword)
                : password === storedPassword;

            if(!passwordMatch){
                return res.status(404).send({
                    isError: true,
                    message: 'password is wrong',
                    data: null
                })
            }

            

            // step 5 : token            
            let token = createToken({
                id: findEmail.dataValues.id,
                username: findEmail.dataValues.email,
                status: findEmail.dataValues.role,
                role: findEmail.dataValues.role,
            });

            // step 6 : kirim response
            res.status(201).send({
                isError: false, 
                message: 'Login Success', 
                data: token
            })

        } catch (error) {
            console.error("login error:", error)
            res.status(404).send({
                isError: true, 
                message: "Login Failed", 
                data: null
            })
        }
    },

    registerbranchadmin: async(req, res) => {
        try {
            let {email, password} = req.body;

            if(!email || !password)
                return res.status(404).send({
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
                return res.status(404).send({
                isError: true, 
                message: 'Email already exist', 
                data: null
            });

            const createBranchAdmin = await admin.create({
                email: email,
                password: await hashPassword(password),
                role: "branch admin"
            })

            res.status(200).send({
                isError: false, 
                message: 'Register Success', 
                data: null
                });

        } catch (error) {
            console.error("registerbranchadmin error:", error)
            res.status(404).send({
				isError: true,
				message: "Register Failed",
				data: null,
			});   
        }
    },

    getTransactionUser: async(req, res) => {
        try {
            const findTransaction = await db.transactions.findAll({
                attributes: ['id', 'orderId', 'date', 'expiry_date', 'payment_proof', 'user_id', 'total', 'city', 'address', 'postal_code', 'shipping'],
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
            console.error("getTransactionUser error:", error)
            res.status(400).send({
                isError: true,
                message: "Get Transaction Failed",
                data: null,
            })
        }

    },

    updateTransactionStatus: async(req, res) => {
        const {transactionStatus} = req.body;
        const { id: transactionId } = req.params;

        try {
            if (!transactionId) {
                return res.status(400).send({
                    isError: true,
                    message: "Transaction id is required",
                    data: null,
                })
            }

            if (!transactionStatus) {
                return res.status(404).send({
                    isError: true,
                    message: "Transaction Status is required",
                    data: null,
                })
            }

            const statusMap = {
                "Confirm Payment": 3,
                "delivery": 4,
                "cancel": 6,
            }

            const nextStatusId = statusMap[transactionStatus];

            if (!nextStatusId) {
                return res.status(400).send({
                    isError: true,
                    message: "Invalid transaction status",
                    data: null,
                })
            }

            const findTransactionStatus = await transaction.findOne({
                where: {
                    id: transactionId
                }
            })

            if(!findTransactionStatus){
                return res.status(404).send({
                    isError: true,
                    message: "Transaction Not Found",
                    data: null,
                })
            }

            await transaction.update({
                transaction_status_id: nextStatusId,
            }, {
                where: { id: transactionId }
            })

            res.status(200).send({
                isError: false,
                message: "Update Transaction Status Success",
                data: null,
            })
            
        } catch (error) {
            console.error("updateTransactionStatus error:", error)
            res.status(404).send({
                isError: true,
                message: "Update Transaction Status Failed",
                data: null,
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
                        attributes: ['url']
                    },
                    {
                        model: categoryProducts,
                        attributes: ['category']
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
            console.error("getAllProducts error:", error)
            res.status(404).send({
                isError: true,
                message: "Get All Products Failed",
                data: null,
            })
        }
    },

    getBranchProducts: async(req, res) => {
        try {
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
            console.error("getBranchProducts error:", error)
            res.status(400).send({
                isError: true,
                message: "Get Branch Products Failed",
                data: null,
            })
        }
    },
 
    createProduct: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const { product_name, product_desc, product_category, product_price, product_stock, branch_id } = req.body;

            if (!product_name || !product_desc || !product_category || !product_price || !product_stock || !branch_id) {
                return res.status(400).send({
                    isError: true,
                    message: "All fields are required (product_name, product_desc, product_category, product_price, product_stock, branch_id)",
                    data: null,
                })
            }

            let productCategory = await categoryProducts.findOne({
                where: { category: product_category }
            });

            if (!productCategory) {
                productCategory = await categoryProducts.create({
                    category: product_category,
                }, {transaction: t})
            }

            const createProduct = await products.create({
                products_name: product_name,
                category_id: productCategory.id,
            }, {transaction: t})

            const createProductDetail = await productsDetail.create({
                product_id: createProduct.id,
                price: product_price,
                desc: product_desc,
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
            console.error("createProduct error:", error)
            res.status(404).send({
                isError: true,
                message: "Create Product Failed",
                data: null,
            })
        }
    },

    uploadProductImage: async(req, res) => {
        const t = await sequelize.transaction()
        const {product_id} = req.body
        try {
            const findProduct = await products.findOne({
                where: {
                    id: product_id
                }
            })

            if(!findProduct){
                return res.status(404).send({
                    isError: true,
                    message: "Product Not Found",
                    data: null,
                })
            }

            if(!req.files || !req.files.products_images || !req.files.products_images.length){
                return res.status(404).send({
                    isError: true,
                    message: "Image Not Found",
                    data: null,
                })
            }

            const productImagePath = `Public/products_images/${req.files.products_images[0].filename}`

            const uploadProductImage = await productsImage.update({
                url: productImagePath,
            }, {
                where: {
                    product_id: product_id
                },
                transaction: t
            })

            await t.commit()
            res.status(200).send({
                isError: false,
                message: "Upload Product Image Success",
                data: null,
            })

        } catch (error) {
            await t.rollback()
            console.error("uploadProductImage error:", error)
            res.status(400).send({
                isError: true,
                message: "Upload Product Image Failed",
                data: null,
            })
        }

    },

    updateProduct: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const {product_id, product_name, product_category, product_price, product_desc, product_stock} = req.body;

            const findProduct = await products.findOne({
                where: {
                    id: product_id
                }
            })

            if(!findProduct){
                return res.status(404).send({
                    isError: true,
                    message: "Product not found",
                    data: null,
                })
            }

            const updateProduct = await products.update({
                products_name: product_name,
            }, {
                where: {
                    id: product_id,
                },
                transaction: t
            })

            const updateProductCategory = await categoryProducts.update({
                category: product_category
            }, {
                where: {
                    id: findProduct.category_id
                },
                transaction: t
            })

            const updateProductDetail = await productsDetail.update({
                price: product_price,
                desc: product_desc,
            }, {
                where: {
                    product_id: product_id,
                },
                transaction: t
            })

            //update product images

            const updateProductStock = await branchProducts.update({
                stock: product_stock
            }, {
                where: {
                    product_id: product_id,
                },
                transaction: t
            })

            const updateStockHistory = await stockHistory.create({
                product_id: product_id,
                event_type: 'admin change stock',
                event_date: new Date(),
                quantity_changed: product_stock,
                remaining_quantity: product_stock,
            }, {transaction: t})

            await t.commit();

            res.status(200).send({
                isError: false,
                message: "Update Success",
                data: null,
            })

        } catch (error) {
            await t.rollback();
            console.error("updateProduct error:", error)
            res.status(404).send({
                isError: true,
                message: "Update Failed",
                data: null,
            })
        }
    },

    deleteProduct: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const {product_id} = req.body;

            if (!product_id) {
                return res.status(400).send({
                    isError: true,
                    message: "product_id is required",
                    data: null,
                })
            }

            const findProduct = await products.findOne({
                where: {
                    id: product_id
                }
            })

            if(!findProduct){
                return res.status(404).send({
                    isError: true,
                    message: "Product not found",
                    data: null,
                })
            }

            await productsDetail.destroy({
                where: { product_id },
                transaction: t
            })

            await productsImage.destroy({
                where: { product_id },
                transaction: t
            })

            await branchProducts.destroy({
                where: { product_id },
                transaction: t
            })

            await stockHistory.destroy({
                where: { product_id },
                transaction: t
            })

            await discount.destroy({
                where: { product_id },
                transaction: t
            })

            await db.carts.destroy({
                where: { product_id },
                transaction: t
            })

            await db.wishlists.destroy({
                where: { product_id },
                transaction: t
            })

            const deleteProduct = await products.destroy({
                where: { id: product_id },
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
            console.error("deleteProduct error:", error)
            res.status(404).send({
                isError: true,
                message: "Delete Failed",
                data: null,
            })
        }
    },

    getStockHistory: async(req, res) => {
        try {
            const {product_id} = req.query;

            if (!product_id) {
                return res.status(400).send({
                    isError: true,
                    message: "product_id is required",
                    data: null,
                })
            }

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
            console.error("getStockHistory error:", error)
            res.status(404).send({
                isError: true,
                message: "Get Stock History Failed",
                data: null,
            })
        }
    },

    getDiscounts: async(req, res) => {
        try {
            const findDiscounts = await discount.findAll({
                attributes: ['id', 'name', 'voucher_value', 'type', 'expiry_date', 'admin_id', 'product_id']
            })

            res.status(200).send({
                isError: false,
                message: "Get Discounts Success",
                data: findDiscounts,
            })
        } catch (error) {
            console.error("getDiscounts error:", error)
            res.status(400).send({
                isError: true,
                message: "Get Discounts Failed",
                data: null,
            })
        }
    },

    createDiscount: async(req, res) => {
        const t = await sequelize.transaction()
        const {discount_name, discount_type, discount_value, product_id, days} = req.body;
        const {admin_id} = req.params
        const resolvedAdminId = admin_id === 'me' || !admin_id ? req.uid.id : admin_id;
        try{

            if (!discount_name || !discount_type || !discount_value || !product_id || !days) {
                return res.status(400).send({
                    isError: true,
                    message: "discount_name, discount_type, discount_value, product_id and days are required",
                    data: null,
                })
            }

            const findAdmin = await admin.findByPk(resolvedAdminId)
            if(!findAdmin){
                return res.status(404).send({
                    isError: true,
                    message: "Admin not found",
                    data: null,
                })
            }
            const today = new Date()
            const expiry_date = new Date(today.setDate(today.getDate() + days))
            const productIds = Array.isArray(product_id) ? product_id : [product_id]
            const discounts = []

            for(const productId of productIds){
                const newDiscount = {
                    name: discount_name,
                    type: discount_type,
                    voucher_value: discount_value,
                    expiry_date: expiry_date,
                    admin_id: resolvedAdminId,
                    product_id: productId
                };

                discounts.push(newDiscount)
            }

            const createDiscount = await discount.bulkCreate(discounts, {transaction: t});

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Create Discount Success",
                data: createDiscount,
            })

        } catch(error){

            await t.rollback()
            console.error("createDiscount error:", error)
            res.status(400).send({
                isError: true,
                message: "Create Discount Failed",
                data: null,
            })

        }
    },

    checkStatus: async(req, res ) => {
        const adminId = req.uid.id
        const status = req.uid.status
        const role = req.uid.role || status
        const username = req.uid.username
        try {
            res.status(200).send({
                isError: false,
                message: "Check Status Success",
                data: {role, username}
            })
        } catch (error) {
            console.error("checkStatus error:", error)
            res.status(400).send({
                isError: true,
                message: "Check Status Failed",
                data: null
            })
            
        }
    },

    getAllUsers: async(req, res) => {
        try {
            const findUsers = await users.findAll({
                attributes: ['id', 'username', 'email', 'phone_number', 'status', 'createdAt'],
                include: [{
                    model: profiles,
                    attributes: ['name', 'gender', 'birthdate', 'profile_pic_url']
                }],
                order: [['createdAt', 'DESC']]
            })

            const counts = await db.transactions.findAll({
                attributes: ['user_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                group: ['user_id'],
                raw: true
            })
            const countMap = {}
            counts.forEach((c) => { countMap[c.user_id] = Number(c.count) })

            const data = findUsers.map((u) => {
                const json = u.toJSON()
                json.transaction_count = countMap[json.id] || 0
                return json
            })

            res.status(200).send({
                isError: false,
                message: "Get Users Success",
                data,
            })
        } catch (error) {
            console.error("getAllUsers error:", error)
            res.status(404).send({
                isError: true,
                message: "Get Users Failed",
                data: null,
            })
        }
    },

    createUser: async(req, res) => {
        try {
            const { username, email, password, name, phone_number } = req.body;

            if (!username || !email || !password) {
                return res.status(400).send({
                    isError: true,
                    message: "username, email and password are required",
                    data: null,
                })
            }

            const findEmail = await users.findOne({
                where: { email }
            })

            if (findEmail) {
                return res.status(404).send({
                    isError: true,
                    message: "Email already exist",
                    data: null,
                })
            }

            const createUsers = await users.create({
                username: username,
                email: email,
                password: await hashPassword(password),
                phone_number: phone_number || '',
                status: 'Confirmed',
            })

            await profiles.create({
                user_id: createUsers.id,
                name: name || username,
            })

            res.status(200).send({
                isError: false,
                message: "Create User Success",
                data: null,
            })
        } catch (error) {
            console.error("createUser error:", error)
            res.status(404).send({
                isError: true,
                message: "Create User Failed",
                data: null,
            })
        }
    },

    updateUser: async(req, res) => {
        try {
            const { id } = req.params;
            const { username, email, phone_number, status, name, gender, birthdate } = req.body;

            const findUser = await users.findOne({
                where: { id }
            })

            if (!findUser) {
                return res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null,
                })
            }

            await users.update({
                username: username,
                email: email,
                phone_number: phone_number,
                status: status,
            }, {
                where: { id }
            })

            const findProfile = await profiles.findOne({
                where: { user_id: id }
            })

            if (findProfile) {
                await profiles.update({
                    name: name,
                    gender: gender,
                    birthdate: birthdate,
                }, {
                    where: { user_id: id }
                })
            } else {
                await profiles.create({
                    user_id: id,
                    name: name,
                    gender: gender,
                    birthdate: birthdate,
                })
            }

            res.status(200).send({
                isError: false,
                message: "Update User Success",
                data: null,
            })
        } catch (error) {
            console.error("updateUser error:", error)
            res.status(404).send({
                isError: true,
                message: "Update User Failed",
                data: null,
            })
        }
    },

    deleteUser: async(req, res) => {
        const t = await sequelize.transaction()
        try {
            const { id } = req.params;

            const findUser = await users.findOne({
                where: { id }
            })

            if (!findUser) {
                return res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null,
                })
            }

            await profiles.destroy({
                where: { user_id: id },
                transaction: t
            })

            await db.carts.destroy({
                where: { user_id: id },
                transaction: t
            })

            await db.address.destroy({
                where: { user_id: id },
                transaction: t
            })

            await db.wishlists.destroy({
                where: { user_id: id },
                transaction: t
            })

            const userTransactions = await db.transactions.findAll({
                attributes: ['id'],
                where: { user_id: id },
                transaction: t
            })
            const transactionIds = userTransactions.map((tr) => tr.id)

            if (transactionIds.length) {
                await db.transactions_log.destroy({
                    where: { transaction_id: transactionIds },
                    transaction: t
                })
                await db.transactions_details.destroy({
                    where: { transaction_id: transactionIds },
                    transaction: t
                })
                await db.transactions.destroy({
                    where: { id: transactionIds },
                    transaction: t
                })
            }

            await users.destroy({
                where: { id },
                transaction: t
            })

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Delete User Success",
                data: null,
            })
        } catch (error) {
            await t.rollback()
            console.error("deleteUser error:", error)
            res.status(404).send({
                isError: true,
                message: "Delete User Failed",
                data: null,
            })
        }
    },

    getSettings: async(req, res) => {
        try {
            const foundSettings = await settings.findAll({
                attributes: ['key', 'value']
            })

            const result = {}
            foundSettings.forEach((s) => {
                result[s.key] = s.value
            })

            res.status(200).send({
                isError: false,
                message: "Get Settings Success",
                data: result,
            })
        } catch (error) {
            console.error("getSettings error:", error)
            res.status(404).send({
                isError: true,
                message: "Get Settings Failed",
                data: null,
            })
        }
    },

    saveSettings: async(req, res) => {
        try {
            const data = req.body;

            if (!data || typeof data !== 'object') {
                return res.status(400).send({
                    isError: true,
                    message: "Settings payload is required",
                    data: null,
                })
            }

            const rows = Object.keys(data).map((key) => ({
                key: key,
                value: data[key],
            }))

            await settings.bulkCreate(rows, {
                updateOnDuplicate: ['value', 'updatedAt'],
            })

            res.status(200).send({
                isError: false,
                message: "Save Settings Success",
                data: null,
            })
        } catch (error) {
            console.error("saveSettings error:", error)
            res.status(404).send({
                isError: true,
                message: "Save Settings Failed",
                data: null,
            })
        }
    }
};


