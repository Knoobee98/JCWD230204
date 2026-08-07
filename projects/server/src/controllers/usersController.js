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
const {createToken, createResetToken, validateToken} = require('../lib/jwtoken')

const transporter = require('./../helpers/transport');
const { logEmail } = require('./../helpers/emailLog');
const fs = require('fs').promises
const handlebars = require('handlebars');
const path = require("path");

module.exports = {
    register: async(req, res) => {
        // rollback
        const t = await sequelize.transaction() 
        try {
            // step 1: ambil data dari req.body
            const {username, email, password, phone_number} = req.body

            // step 2: validasi
            if(!username || !email || !password || !phone_number)
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

            // step 4: simpan data ke database 
            const resCreateUser = await users.create({id: uuidv4(), username, email, password: await hashPassword(password), phone_number, status: 'unconfirmed'}, {transaction: t})
            
            const resCreateProfile = await profiles.create({
                user_id: resCreateUser.id
            }, {transaction: t})


            // step 5 : kirim email (fire-and-forget, non-blocking)
            fs.readFile(path.resolve(__dirname, '../template/confirmation.html'), 'utf-8')
                .then((template) => {
                    const newTemplate = handlebars.compile(template)({username: username, url: `${process.env.CLIENT_BASE_URL || 'https://jcwd230204.purwadhikabootcamp.com'}/activation/${resCreateUser.id}`})
                    return transporter.sendMail({
                        from: 'GAMEPEDIA',
                        to: email,
                        subject: 'Account Activation',
                        html: newTemplate
                    })
                })
                .then(() => { console.log("activation email sent"); logEmail({to: email, subject: 'Account Activation', ok: true}) })
                .catch((emailError) => { console.error("activation email send failed:", emailError); logEmail({to: email, subject: 'Account Activation', ok: false, error: emailError.message, smtpResponse: emailError.response || null}) })

            // step 6 : kirim response
            await t.commit()
            res.status(201).send({
                isError: false, 
                message: 'Register Success', 
                data: null
            })
        } catch (error) {
            await t.rollback()
            console.error("register error:", error)
  
            res.status(404).send({
                isError: true, 
                message: "Register Failed", 
                data: null
            })
        }
    },

    activation: async(req, res) => {
        let {id} = req.params;
        
        try {
            const findUser = await users.findOne({ where: { id } })

            if (!findUser) {
                return res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null
                })
            }

            await users.update(
                {status: 'Confirmed'},
                {
                    where: {
                        id
                    }
                }
            )

            // Step-3 Kirim response
            return res.status(200).send({
                isError: false, 
                message: 'Account Verified!',
                data: null 
            })
            } catch (error) {
                console.error("activation error:", error)
                res.status(404).send({
                    isError: true,
                    message: "Activation Failed",
                    data: null
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
                role: 'user',
            });

            res.status(200).send({
                isError: false, 
                message: 'Login Success', 
                data: {token},
                    // tambahkan status user verified or not
                });
        } catch (error) {
            console.error("login error:", error)
            res.status(404).send({
				isError: true,
				message: "Login Failed",
				data: null,
			});   
        }
    },

    keepLogin: async (req, res) => {
        try {
            res.status(200).send({
                isError: false,
                message: "Token Valid",
                data: req.uid,
            });
        } catch (error) {
            console.error("keepLogin error:", error)
            res.status(500).send({
                isError: true,
                message: "Token Invalid",
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

            const resetToken = createResetToken({ id: findEmail.dataValues.id });

            // send reset email (fire-and-forget, non-blocking)
            fs.readFile(path.resolve(__dirname, '../template/resetPassword.html'), 'utf-8')
                .then((template) => {
                    const newTemplate = handlebars.compile(template)({
                        username, url: `${process.env.CLIENT_BASE_URL || 'https://jcwd230204.purwadhikabootcamp.com'}/user/resetPassword/${resetToken}`,
                    })
                    return transporter.sendMail({
                        from: "Gamepedia",
                        to: email,
                        subject: "Reset Password",
                        html: newTemplate,
                    })
                })
                .then(() => { console.log("reset password email sent"); logEmail({to: email, subject: 'Reset Password', ok: true}) })
                .catch((emailError) => { console.error("reset password email send failed:", emailError); logEmail({to: email, subject: 'Reset Password', ok: false, error: emailError.message, smtpResponse: emailError.response || null}) })

            res.status(200).send({
                isError: false,
                message: "Please Check Your Email",
                data: null,
            });
        } catch (error) {
            console.error("forgotPassword error:", error)
            res.status(404).send({
                isError: true,
                message: "Forgot Password Failed",
                data: null,
            });
        }
    },

    resetPassword: async (req, res) => {
        try {
            let { token } = req.params;
            let { password, confirmPassword } = req.body;

            if (!token) {
                return res.status(400).send({
                    isError: true,
                    message: "Reset token is required",
                    data: null
                })
            }

            let payload;
            try {
                payload = validateToken(token);
            } catch (err) {
                return res.status(400).send({
                    isError: true,
                    message: "Reset token is invalid or has expired",
                    data: null
                })
            }

            let findUser = await users.findOne({
                where: {
                    id: payload.id
                }
            })

            if(!findUser){
                return res.status(400).send({
                    isError: true,
                    message: "user not found",
                    data: null
                })
            }

            if (!password || !confirmPassword)
                return res.status(404).send({
                    isError: true,
                    message: "Please Input Your Password",
                    data: null,
                });

            if (password !== confirmPassword)
                return res.status(404).send({
                    isError: true,
                    message: "Password Not Match",
                    data: null,
                });

            await users.update(
                { password: await hashPassword(password) },
                {
                    where: {
                        id: payload.id,
                    },
                }
            );
            

            res.status(201).send({
                isError: false,
                message: "Update Password Success",
                data: null,
            });
        } catch (error) {
            console.error("resetPassword error:", error)
            res.status(500).send({
                isError: true,
                message: "Reset Password Failed",
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
                return res.status(400).send({
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
            console.error("changePassword error:", error)
            res.status(500).send({
                isError: true,
                message: "Change Password Failed",
                data: null,
            });
        }
    },

    getProfile: async(req, res) => {
        const id = req.uid.id;
        try {
            const findUser = await users.findOne({where: {id}})
            if(!findUser){
                return res.status(404).send({
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
                ],
                where: {
                    user_id: id
                }
              })
              
            if(!findProfile.length){
                return res.status(404).send({
                    isError: true,
                    message: "Profile not found",
                    data: null
                })
            }

            return res.status(200).send({
                isError: false,
                message: "Get Profile Success",
                data: findProfile
            })
            
        } catch (error) {
            console.error("getProfile error:", error)
            res.status(404).send({
                isError: true,
                message: "Get Profile Failed",
                data: null
            })
        }
    },


    updateProfile: async(req, res) => {
        const t = await sequelize.transaction()
        const id = req.uid.id;
        try {
            const {name, gender, birthdate, email} = req.body;

            let findUser = await db.users.findOne({
                where: {id},
            })

            if (!findUser) {
                return res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null
                })
            }

            let updateUser = await db.profiles.update({
                name: name,
                gender: gender,
                birthdate: birthdate,
            }, {
                where: {user_id: id},
                transaction: t
            })

            let updateEmail = await users.update({
                email: email
            }, {
                where: {id},
                transaction: t
            })

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Update profile success",
                data: null
            })

        } catch (error) {
            await t.rollback()
            console.error("updateProfile error:", error)
            res.status(404).send({
                isError: true,
                message: "Update profile failed",
                data: null
            })
        }
    },

    uploadProfilePicture: async(req, res) => {
        const t = await sequelize.transaction();
        const id = req.uid.id;
        try {

            const findUser = await users.findOne({ where: { id } })

            if(!findUser) {
                return res.status(404).send({
                    isError: true,
                    message: "User not found",
                    data: null
                })
            }

            if(!req.profilePicture){
                return res.status(404).send({
                    isError: true,
                    message: "File not found",
                    data: null
                })
            }
            
            let ProfilePictPath = `Public/profile_picture/${req.profilePicture.filename}`

            let updateProfilePicture = await profiles.update({
                profile_pic_url: ProfilePictPath
            }, {
                where: {
                    user_id: id
                },
                transaction: t
            })

            await t.commit()

            res.status(200).send({
                isError: false,
                message: "Upload profile picture success",
                data: null
            })

        } catch (error) {
            await t.rollback()
            console.error("uploadProfilePicture error:", error)
            res.status(404).send({
                isError: true,
                message: "Upload profile picture failed",
                data: null
            })
        }
    }

}
