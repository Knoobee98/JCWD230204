// import Sequelize
const {sequelize} = require('./../models');

// to generate uuid
const { v4: uuidv4 } = require('uuid')

// import model
const db = require('./../models/index');
const users = db.users;
const profiles = db.profiles;

// import hash
const {hashPassword, hashMatch} = require('./../lib/hash')
// import jwtoken
const {createToken} = require('../lib/jwtoken')

const transporter = require('./../helpers/transport');
const fs = require('fs').promises
const handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const path = require("path");

module.exports = {
    register: async(req, res) => {
        // rollback
        const t = await sequelize.transaction() 
        try {
            console.log('masuk register')

            // step 1: ambil data dari req.body
            const {username, email, password, phone_number} = req.body

            // step 2: validasi
            if(!username.length || !email.length || !password.length || !phone_number.length )
            return res.status(404).send({
                isError: true,
                message: 'Input is required',
                data: null
            })
        
            // step 3: check ke database, username & email nya exist
            let findEmail= await users.findOne({
                where: {
                        email
                }
            })
            if(findEmail)
                return res.status(404).send({
                    isError: true,
                    message: 'email already exist',
                    data: null
                })
                console.log(findEmail)

            // step 4: simpan data ke database 
            const resCreateUser = await users.create({id: uuidv4(), username, email, password: await hashPassword(password), phone_number, status: 'unconfirmed'}, {transaction: t})
            
            const resCreateProfile = await profiles.create({
                user_id: resCreateUser.id
            }, {transaction: t})


            // step 5 : kirim email
            const template = await fs.readFile(path.resolve(__dirname, '../template/confirmation.html'), 'utf-8')
            const templateToCompile = handlebars.compile(template)
            const newTemplate = templateToCompile({username:username, url: `https://jcwd230204.purwadhikabootcamp.com/activation/${resCreateUser.id}`,})
     
            await transporter.sendMail({
                from: 'GAMEPEDIA',
                to: email,
                subject: 'Account Activation',
                html: newTemplate
            })

            // step 6 : kirim response
            await t.commit()
            res.status(201).send({
                isError: false, 
                message: 'Register Success', 
                data: null
            })
        } catch (error) {
            await t.rollback()
            console.log(error)
  
            res.status(404).send({
                isError: true, 
                message: "Register Failed", 
                data: error
            })
        }
    },

    activation: async(req, res) => {
        let {id} = req.body
        
        try {

            await users.update(
                {status: 'Confirmed'},
                {
                    where: {
                        id
                    }
                }
            )

            // Step-3 Kirim response
            res.status(200).send({
                isError: false, 
                message: 'Account Verified!',
                data: null 
            })
            } catch (error) {
                console.log(error)
                res.status(404).send({
                    isError: true,
                    message: "Activation Failed",
                    data: error.message
                })
            }
         },


 
    login: async(req, res) => {
        try {
            let {email, password} = req.body;

            if(!email || !password)
                return res.status(404).send({
                    isError: true,
                    message: "Input must be filled",
                    data: null,
                })

            let findEmail = await users.findOne({
                where: { 
                    email
                }
            });

            if(!findEmail) 
                return res.status(404).send({
                isError: true, 
                message: 'Email Not Found', 
                data: null
            });

            let hashMatchResult = await hashMatch(
                password, findEmail.dataValues.password);
            
            if(hashMatchResult === false) 
                return res.status(404).send({
                isError: true, 
                message: 'Password is Not Valid', 
                data: null,
            })

            let token = createToken({
                id: findEmail.dataValues.id,
                username: findEmail.dataValues.username,
                status: findEmail.dataValues.status,
            });

            res.status(200).send({
                isError: false, 
                message: 'Login Success', 
                data: {token},
                    // tambahkan status user verified or not
                });
        } catch (error) {
            res.status(404).send({
				isError: true,
				message: "Login Failed",
				data: error.message,
			});   
        }
    },

    keepLogin: async (req, res) => {
        try {
            res.status(200).send({
                isError: false,
                message: "Token Valid",
                data: req.uid.name,
            });
        } catch (error) {
            res.status(500).send({
                isError: true,
                message: error.message,
                data: null,
            });
        }
    },

    forgotPassword: async(req, res) => {
        try {
            let { email } = req.body;

            if (!email)
                return res.status(404).send({
                    isError: true,
                    message: "Please Input Your Email",
                });

            let findEmail = await users.findOne({
                where: {
                    email: email,
                },
            });

            if (!findEmail)
                return res.status(404).send({
                    isError: true,
                    message: "Email Not Found",
                    data: null,
                });

            const username = findEmail.dataValues.username;

            const template = await fs.readFile(path.resolve(__dirname, '../template/resetPassword.html'), 'utf-8')
            const templateToCompile = await handlebars.compile(template);
            const newTemplate = templateToCompile({
                username, url: `https://jcwd230204.purwadhikabootcamp.com/user/resetPassword/${findEmail.dataValues.id}`,
            });

            await transporter.sendMail({
                from: "Gamepedia",
                to: email,
                subject: "Reset Password",
                html: newTemplate,
            });

            res.status(200).send({
                isError: false,
                message: "Please Check Your Email",
                data: null,
            });
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null,
            });
        }
    },

    resetPassword: async (req, res) => {
        try {
            let { id, password, confirmPassword } = req.body;
            console.log(id)

            let findUser = await users.findOne({
                where: {
                    id
                }
            })

            if(!findUser){
                res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: null
                })
            }

            if (!password.length&&!confirmPassword.length)
                return res.status(404).send({
                    isError: true,
                    message: "Please Input Your Password",
                    data: null,
                });

            if (password !== confirmPassword)
                return res.status(404).send({
                    isError: true,
                    message: "Password Not Match",
                    data: password,
                    confirmPassword,
                });

            await users.update(
                { password: await hashPassword(password) },
                {
                    where: {
                        id: id,
                    },
                }
            );
            

            res.status(201).send({
                isError: false,
                message: "Update Password Success",
                data: null,
            });
        } catch (error) {
            res.status(500).send({
                isError: true,
                message: error.message,
                data: null,
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            let { password, newPassword, confirmPassword} = req.body;
            let {id} = req.uid;

            let findUser = await users.findOne({
                where: {
                    id
                }
            })

            if(!findUser){
                res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: null
                })
            }

            if (!password && !newPassword)
            return res.status(404).send({
                isError: true,
                message: "Please Input Your Password",
                data: null,
            });
            console.log(findUser.dataValues.password)
            let hashMatchResult = await hashMatch(password, findUser.dataValues.password);
            
            if(hashMatchResult === false) 
                return res.status(404).send({
                isError: true, 
                message: 'Password is Not Valid', 
                data: null,
                })

            if (newPassword !== confirmPassword)
            return res.status(404).send({
                isError: true,
                message: "Password Not Match",
                data: null
            });
            
            await users.update(
                { password: await hashPassword(newPassword) },
                {
                    where: {
                        id: id,
                    },
                }
            );

            res.status(201).send({
                isError: false,
                message: "Update Password Success",
                data: null,
            });

        } catch (error) {
            res.status(500).send({
                isError: true,
                message: error.message,
                data: null,
            });
        }
    },

    getProfile: async(req, res) => {
        const token = req.headers.token;
        const decodeToken = jwt.decode(token, {complete: true});
        const id = decodeToken.payload.id;
        try {
            const findUser = await users.findOne({id})
            if(!findUser){
                res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null
                })
            }
            const findProfile = await profiles.findAll({
                attributes: [
                  'name', 
                  'gender', 
                  'birthdate', 
                  'profile_pic_url'
                ],
                include: [
                  {
                    model: users,
                    attributes: [
                      'email', 
                      'username', 
                      'phone_number'
                    ]
                  }
                ]
              })
              
            if(!findProfile){
                res.status(404).send({
                    isError: true,
                    message: "Profile not found",
                    data: null
                })
            }

            res.status(200).send({
                isError: false,
                message: "Get Profile Success",
                data: findProfile
            })
            
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },


    updateProfile: async(req, res) => {
        const t = await sequelize.transaction()
        const token = req.headers.token;
        const decodeToken = jwt.decode(token, {complete: true});
        const id = decodeToken.payload.id;
        try {
            const {name, gender, birthdate, email} = req.body;
            console.log(name, gender, birthdate, id);

            let findUser = await db.profiles.findAll({
                where: {id},
            })

            if (!findUser) {
                res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null
                })
            }
            console.log(findUser)

            let updateUser = await db.profiles.update({
                name: name,
                gender: gender,
                birthdate: birthdate,
            }, {
                where: {id}
            }, {transaction: t})

            let updateEmail = await users.update({
                email: email
            }, {
                where: {id}
            }, {transaction: t})

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Update profile success",
                data: null
            })

        } catch (error) {
            await t.rollback()
            res.status(404).send({
                isError: true,
                message: "Update profile failed",
                data: error.message
            })
        }
    },

    uploadProfilePicture: async(req, res) => {
        const t = await sequelize.transaction();
        const token = req.headers.token
        const decodeToken = jwt.decode(token, { complete: true })
        const id = decodeToken.payload.id
        try {

            const findUser = await users.findOne({ id })

            if(!findUser) {
                res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null
                })
            }

            if(!req.files){
                res.status(404).send({
                    isError: true,
                    message: "File not found",
                    data: null
                })
            }
            
            let ProfilePictPath = `Public/images/${req.files.images[0].filename}`

            let updateProfilePicture = await profiles.update({
                profile_pic_url: ProfilePictPath
            }, {
                where: {
                    user_id: id
                }
            }, {transaction: t})

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Upload profile picture success",
                data: null
            })

        } catch (error) {
            await t.rollback()
            res.status(404).send({
                isError: true,
                message: "Upload profile picture failed",
                data: error.message
            })
        }
    }

}
