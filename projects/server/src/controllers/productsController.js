const {sequelize} = require('./../models');
const jwt = require('jsonwebtoken');


const db = require('./../models/index');
const products = db.products;
const category = db.category;
const products_detail = db.products_detail;
const products_image = db.products_image;
const discounts_categories = db.discount_category;
const discount = db.discounts;
const transactions = db.transactions;
const transactions_details = db.transactions_details;
const cart = db.carts;
const users = db.users;

const {Op} = require('sequelize');

module.exports = {
    getAllProducts: async(req, res) => {
        const {sortBy, sortType, filter, search} = req.query
        const productsPerPage = parseInt(req.query.productsPerPage) || 10
        const currentPage = parseInt(req.query.currentPage) || 1
        console.log(sortBy, sortType, filter, search)
        let findProducts;
        
        try {
             findProducts = await products.findAll({
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
                    },
                    {
                        model: category,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }
                ]
            })

            //template for filter by products name
            // Product.findAll({
            //     include: [{ model: Category }, { model: ProductDetail }],
            //     attributes: ['products_name', [Sequelize.col('ProductDetail.description'), 'description'], [Sequelize.col('ProductDetail.price'), 'price'], [Sequelize.col('Category.category'), 'category']],
            //     where: { products_name: { [Sequelize.Op.like]: '%sony%' } }
            //   });

            //template for filter by category name
            // Product.findAll({
            //     include: [{ model: Category }, { model: ProductDetail }],
            //     attributes: ['products_name', [Sequelize.col('ProductDetail.description'), 'description'], [Sequelize.col('ProductDetail.price'), 'price'], [Sequelize.col('Category.category'), 'category']],
            //     where: { '$Category.category$': { [Sequelize.Op.like]: '%acces%' } }
            //   });
              
            //filter products
            // filter by products name
            if(filter === 'productsName' ){
                findProducts = await products.findAll({
                    include: [{model: category, required: true}, {model:products_detail, required: true}, {model:products_image, required: true}],
                    attributes: ['id', 'products_name', [sequelize.col('products_details.desc'), 'desc'], [sequelize.col('products_details.price'), 'price'], [sequelize.col('category.category'), 'category'], [sequelize.col('products_images.url'), 'url']],
                    where: {products_name: {[Op.like]: `%${search}%`}}
                })
            } else if(filter === 'category'){
                findProducts = await products.findAll({
                    include: [{model: category, required: true}, {model:products_detail, required: true}, {model:products_image, required: true}],
                    attributes: ['id', 'products_name', [sequelize.col('products_details.desc'), 'desc'], [sequelize.col('products_details.price'), 'price'], [sequelize.col('category.category'), 'category'], [sequelize.col('products_images.url'), 'url']],
                    where: {'$category.category$': {[Op.like]: `%${search}%`}}
                })
            }

            //template for sort by name
            // Product.findAll({
            //     include: [{ model: ProductDetail }],
            //     attributes: ['products_name', [Sequelize.col('ProductDetail.description'), 'description'], [Sequelize.col('ProductDetail.price'), 'price']],
            //     order: [['products_name', 'ASC']]
            //   });

            //template for sort by price
            // Product.findAll({
            //     include: [{ model: ProductDetail }],
            //     attributes: ['products_name', [Sequelize.col('ProductDetail.description'), 'description'], [Sequelize.col('ProductDetail.price'), 'price']],
            //     order: [[Sequelize.col('ProductDetail.price'), 'ASC']]
            //   });
                            

            //sort products
            //sort by name asc
            if(sortBy === 'name' && sortType === 'asc'){
                findProducts = await products.findAll({
                    include: [{model: products_detail, required: true}, {model:products_image, required: true}],
                    attributes: ['id', 'products_name', [sequelize.col('products_details.desc'), 'desc'], [sequelize.col('products_details.price'), 'price'], [sequelize.col('products_images.url'), 'url']],
                    order: [['products_name', 'ASC']]
                  });
                  
            } else
            
            if(sortBy === 'name' && sortType === 'desc'){
                findProducts = await products.findAll({
                    include: [{model: products_detail, required: true}, {model:products_image, required: true}],
                    attributes: ['id', 'products_name', [sequelize.col('products_details.desc'), 'desc'], [sequelize.col('products_details.price'), 'price'], [sequelize.col('products_images.url'), 'url']],
                    order: [['products_name', 'DESC']]
                })
            } else
            //sort by price asc
            if(sortBy === 'price' && sortType === 'asc'){
                findProducts = await products.findAll({
                    include: [{model: products_detail, required: true}, {model:products_image, required: true}],
                    attributes: ['id', 'products_name', [sequelize.col('products_details.desc'), 'desc'], [sequelize.col('products_details.price'), 'price'], [sequelize.col('products_images.url'), 'url']],
                    order: [[sequelize.col('products_details.price'), 'ASC']]
                })
            } else
            //if sort by product price order descending then sort product by product price descending
            if(sortBy === 'price' && sortType === 'desc'){
                findProducts = await products.findAll({
                    include: [{model: products_detail, required: true}, {model:products_image, required: true}],
                    attributes: ['id', 'products_name', [sequelize.col('products_details.desc'), 'desc'], [sequelize.col('products_details.price'), 'price'], [sequelize.col('products_images.url'), 'url']],
                    order: [[sequelize.col('products_details.price'), 'DESC']]
                })
            }

            const findImg = await products_image.findAll({
                include: [{model: products}],
            })
            console.log(findProducts)


            res.status(200).send({
                isError: false,
                message: "get data sucess",
                data: findProducts
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: "get data failed",
                data: error.message
            })
        }
    },

    getProductDetail: async(req, res) => {
        try{
            const {id} = req.query
            console.log(id)
            let findProductDetail = await await products.findAll({
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
            let findRecommendedProducts = await transactions.findAll({
                attributes: [
                    [sequelize.literal('products.*'), 'product'],
                    [sequelize.fn('COUNT', sequelize.col('transactions.productId')), 'count']
                  ],
                  include: [
                    {
                      model: products,
                      attributes: []
                    }
                  ],
                  group: ['transactions.productId'],
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
        const token = req.headers.token
        console.log(token)
        const decodedToken = jwt.decode(token, {complete: true})
        console.log(decodedToken)
        const id = decodedToken.payload.id
        console.log(id)

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
            //check token
            const token = req.headers.token
            //obtain id from token
            const decodedToken = jwt.decode(token, {complete: true})
            const id = decodedToken.payload.id

            const findUser = await users.findOne({
                where: {
                    id
                }
            })

            //check user
            if(!findUser){
                res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: {}
                })
            }

            if(findUser.status === "unconfirmed"){
                res.status(400).send({
                    isError: true,
                    message: "user not confirmed, please confirmed your email",
                    data: null
                })
            }

            const findProducts = await cart.findOne({
                where: {
                    product_id
                }
            })

            //data cart validation
            if(!findProducts){
                await cart.create({product_id, qty: parseInt(quantity), user_id: id})
            } else {
                await cart.update({qty: parseInt(findProducts.qty) + parseInt(quantity)}, {
                    where: {
                        product_id
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
            console.log(id)

            //validasi data cart
            await cart.destroy({
                where: {
                    id
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
        
        try {
            const findItem = await cart.findOne({
                where: {
                    id
                }
            })

            if(option === "plus"){
                await cart.update({qty: parseInt(findItem.qty) + 1}, {
                    where: {
                        id
                    }
                })
            } else if(option === "min") {
                await cart.update({qty: parseInt(findItem.qty) - 1}, {
                    where: {
                        id
                    }
                })
            } else {

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
                include: ['id', 'event_type', 'quantity_changed', 'remaining_quantity', 'product_id']
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
}