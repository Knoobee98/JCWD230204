const {uploadPaymentProof} = require('../lib/multer')

const uploadFile = (req, res, next) => {
    uploadPaymentProof.single('file')(req, res, function(error) {
        if(error){
            res.status(400).send({
                isError: true,
                message: 'upload file failed',
                data: error.message
            })
        }
        next()
    })
}

export default uploadFile;