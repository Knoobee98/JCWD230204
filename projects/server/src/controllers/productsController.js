const {sequelize} = require('./../models');


const db = require('./../models/index');
const products = db.products;
const category = db.category;
const products_detail = db.products_detail;
const products_image = db.products_image;
const discounts_categories = db.discount_category;
const discount = db.discounts;
const transactions = db.transactions;
const transactions_details = db.transactions_details;
const stock_history = db.stock_history;
const cart = db.carts;
const users = db.users;
const wishlist = db.wishlists;;

const {Op} = require('sequelize');

module.exports = {
    getAllProducts: async(req, res) => {
        const {sortBy, sortType, filter, search} = req.query
        const page = parseInt(req.query.page) || null
        const limit = parseInt(req.query.limit) || 8
        const offset = page ? (page - 1) * limit : 0

        const where = {}
        const order = []

        if(filter === 'productsName' && search){
            where.products_name = {[Op.like]: `%${search}%`}
        } else if(filter === 'category' && search){
            where['$category.category$'] = {[Op.like]: `%${search}%`}
        }

        if(sortBy === 'name'){
            order.push(['products_name', sortType === 'desc' ? 'DESC' : 'ASC'])
        } else if(sortBy === 'price'){
            order.push([[products_detail, 'price', sortType === 'desc' ? 'DESC' : 'ASC']])
        }

        const options = {
            where,
            order,
            include: [
                {
                    model: products_detail,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    required: false,
                },
                {
                    model: products_image,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    required: false,
                },
                {
                    model: category,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    required: false,
                }
            ],
            distinct: true,
        }

        if (page) {
            options.limit = limit
            options.offset = offset
        }

        const { count, rows } = await products.findAndCountAll(options)

        res.status(200).send({
            isError: false,
            message: "get data success",
            data: rows,
            totalItems: count,
            totalPages: page ? Math.ceil(count / limit) : 1,
            currentPage: page || 1,
        })
    },

    getProductDetail: async(req, res) => {
        try{
            const {id} = req.query
            console.log(id)
            let findProductDetail = await products.findAll({
                attributes: ['id', 'products_name'],
                include: [
                  {
                    model: products_detail,
                    attributes: ['desc', 'price']
                  },
                  {
                    model: products_image,
                    attributes: ['url']
                  }
                ],
                where: {id: id}
              });
            console.log(findProductDetail)
            res.status(200).send({
                isError: false,
                message: "get detail success",
                data: findProductDetail
            })

        } catch(error){
            res.status(404).send({
                isError: true,
                message: "get detail failed",
                data: error.message
            })
        }
        
    },

    getCategory: async(req, res) => {
        try {
            let findCategory = await category.findAll()
            console.log(findCategory)

            res.status(200).send({
                isError: false,
                message: "get data sucess",
                data: findCategory
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    getPromo: async(req, res) => {
        try {
            let findPromo = await discounts_categories.findAll()
            console.log(findPromo)

            res.status(201).send({
                isError: false,
                message: "get data sucess",
                data: findPromo
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    getNewProducts: async(req, res) => {
        try {
            //find new products by latest created_at
            let findNewProducts = await products.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: 4,
                include: [
                    {
                        model: products_detail,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                    {
                        model: products_image,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }
                ]
            })
            console.log(findNewProducts)

            res.status(200).send({
                isError: false,
                message: "get data sucess",
                data: findNewProducts
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    getRecommendedProducts: async(req, res) => {
        try {
            //find recommended products by the most purchased items in transactions
            let findRecommendedProducts = await transactions_details.findAll({
                attributes: [
                    'product_name',
                    [sequelize.fn('COUNT', sequelize.col('product_name')), 'count']
                ],
                group: ['product_name'],
                order: [[sequelize.literal('count'), 'DESC']],
                limit: 10
            })
            console.log(findRecommendedProducts)

            res.status(200).send({
                isError: false,
                message: "recommended products found",
                data: findRecommendedProducts
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    getCart: async(req, res) => {
        const id = req.uid.id

        try {
            const findCart = await cart.findAll({
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

            let totalPriceBeforeDiscount = 0
            let totalPriceAfterDiscount = 0
            findCart.forEach((item) => {
                const productPrice = item.dataValues.product.dataValues.products_details[0].dataValues.price
                const productQuantity = item.dataValues.qty
                const discount = item.dataValues.product.dataValues.discounts[0]
                const productPriceBeforeDiscount = productPrice * productQuantity
                let discountAmount = 0
                if(discount){
                    if(discount.dataValues.type === "percent"){
                        discountAmount = productPriceBeforeDiscount * (discount.dataValues.voucher_value / 100)
                    } else {
                        discountAmount = discount.dataValues.voucher_value
                    }
                }
                const productPriceAfterDiscount = productPriceBeforeDiscount - discountAmount
                totalPriceBeforeDiscount += productPriceBeforeDiscount
                totalPriceAfterDiscount += productPriceAfterDiscount

                item.productPriceAfterDiscount = productPriceAfterDiscount
                item.productPriceBeforeDiscount = productPriceBeforeDiscount
            })

            res.status(200).send({
                isError: false,
                message: "get data sucess",
                data: findCart,
                totalAfterDiscount: totalPriceAfterDiscount,
                totalBeforeDiscount: totalPriceBeforeDiscount,
                
            })

        } catch (error) {
            res.status(400).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    addToCart: async(req, res) => {
        const {product_id, quantity} = req.query

        try {
            const id = req.uid.id

            const findUser = await users.findOne({
                where: {
                    id
                }
            })

            //check user
            if(!findUser){
                return res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: {}
                })
            }

            if(findUser.status === "unconfirmed"){
                return res.status(400).send({
                    isError: true,
                    message: "user not confirmed, please confirmed your email",
                    data: null
                })
            }

            const findProducts = await cart.findOne({
                where: {
                    product_id,
                    user_id: id
                }
            })

            //data cart validation
            if(!findProducts){
                await cart.create({product_id, qty: parseInt(quantity), user_id: id})
            } else {
                await cart.update({qty: parseInt(findProducts.qty) + parseInt(quantity)}, {
                    where: {
                        product_id,
                        user_id: id
                    }
                })
            }

            //response
            res.status(200).send({
                isError: false,
                message: "add to cart success",
                data: null
            })

        } catch (error) {
            res.status(400).send({
                isError: true,
                message: "add to cart failed",
                data: error.message
            })
        }
    },

    removeFromCart: async(req, res) => {
        try {
            const {id} = req.query
            const user_id = req.uid.id
            console.log(id)

            //validasi data cart
            await cart.destroy({
                where: {
                    id,
                    user_id
                }
            })
            

            //response
            res.status(200).send({
                isError: false,
                message: "remove from cart success",
                data: null
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: "remove from cart failed",
                data: error.message
            })
        }
    },

    updateCart: async(req, res) => {
        const {id, option} = req.query
        const user_id = req.uid.id
        
        try {
            const findItem = await cart.findOne({
                where: {
                    id,
                    user_id
                }
            })

            if(!findItem){
                return res.status(400).send({
                    isError: true,
                    message: "cart item not found",
                    data: null
                })
            }

            let newQty;

            if(option === "plus"){
                newQty = parseInt(findItem.qty) + 1;
            } else if(option === "min") {
                newQty = parseInt(findItem.qty) - 1;
            } else {
                return res.status(400).send({
                    isError: true,
                    message: "invalid option",
                    data: null
                })
            }

            if(newQty < 0){
                return res.status(400).send({
                    isError: true,
                    message: "quantity cannot negative",
                    data: null
                })
            }

            if(newQty < 1){
                await cart.destroy({
                    where: {
                        id,
                        user_id
                    }
                })
            } else {
                await cart.update({qty: newQty}, {
                    where: {
                        id,
                        user_id
                    }
                })
            }

            res.status(201).send({
                isError: false,
                message: "update cart success",
                data: null
            })

        } catch (error) {
            res.status(400).send({
                isError: true,
                message: "update cart failed",
                data: error.message
            })
        }
    },

    stockHistory: async(req, res) => {
        try {
            const findStockHistory = await stock_history.findAll({
                attributes: ['id', 'event_type', 'quantity_changed', 'remaining_quantity', 'product_id']
            })

            if(!findStockHistory){
                res.status(400).send({
                    isError: true,
                    message: "stock history not found",
                    data: {}
                })
            }

            res.status(200).send({
                isError: false,
                message: "stock history found",
                data: findStockHistory
            })

        } catch (error) {
            res.status(400).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    addWishlist: async(req, res) => {
        const {product_id} = req.query
        const userid = req.uid.id
        
        try {
            const findUser = await users.findOne({
                where: {
                    id: userid
                }
            })

            if(!findUser){
                return res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: null
                })
            } 

            if(findUser.status === "unconfirmed"){
                return res.status(400).send({
                    isError: true,
                    message: "user not confirmed, please confirmed your email",
                    data: null
                })
            }

            const findWishlist = await wishlist.findOne({
                where: {
                    user_id: userid,
                    product_id
                }
            })

            if(findWishlist){
                return res.status(400).send({
                    isError: true,
                    message: "product already in wishlist",
                    data: null
                })
            }

            await wishlist.create({
                product_id: product_id,
                user_id: userid
            })

            res.status(200).send({
                isError: false,
                message: "add wishlist success",
                data: null
            })

        } catch (error) {
            res.status(500).send({
                isError: true,
                message: "add wishlist failed",
                data: error.message
            })
        }
    },

    getWishlists: async(req, res) => {
        const userid = req.uid.id

        try {
            const findUser = await users.findOne({
                where: {
                    id: userid
                }
            })

            if(!findUser){
                return res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: null
                })
            }

            const findWishlist = await wishlist.findAll({
                include: [
                    {model: products, attributes: ['products_name'],
                include: [
                    {model: products_detail, attributes: ['price']},
                    {model: products_image, attributes: ['url']},
                ]},
                ],
                where: {
                    user_id: userid
                }
            })

            res.status(200).send({
                isError: false,
                message: "get wishlist success",
                data: findWishlist
            })
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "get wishlist failed",
                data: error.message
            })
        }
    },

    deleteWishlist: async(req, res) => {
        const {id} = req.query
        const userid = req.uid.id
        try {
            await wishlist.destroy({
                where: {
                    id,
                    user_id: userid
                }
            })

            res.status(200).send({
                isError: false,
                message: "delete wishlist success",
                data: null
            })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "delete wishlist failed",
                data: error.message
            })
        }
    }
}