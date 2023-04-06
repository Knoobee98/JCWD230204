const {multerUpload} = require('../lib/multer')


const uploadPaymentImage = (req,res,next) => {
    const multerResult = multerUpload.fields([{name: 'images'}])
    multerResult(req,res, function(err){
        try {
            console.log('masuk upload')
            if(err) throw err
            req.files.images.forEach((value) => {
                if(value.size > 100000000000) throw {message: 'file size is too large' }
            })
            next()
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    })
}

const uploadProducts = (req,res,next) => {
const multerResult = multerUpload.fields([{name: 'products_images'}])
multerResult(req, res, function(err){
    try {
        if(err) throw err
        req.files.products.forEach((value) => {
            if(value.size > 100000000000) throw {message: 'file size is too large' }
        })
        next()
    } catch(error){
        return res.status(400).send({
            isError: true,
            message: error.message,
            data: null
        })
    }
})
}

const uploadProfilePicture = (req, res, next) => {
    const multerResult = multerUpload.fields([{ name: 'profile_picture' }])
    multerResult(req, res, function (err) {
      try {
        if (err) throw err
        req.profilePicture = req.files.profile_picture[0]
        next()
      } catch (error) {
        return res.status(400).send({
          isError: true,
          message: error.message,
          data: null
        })
      }
    })
  }

module.exports = {uploadPaymentImage, uploadProducts, uploadProfilePicture}