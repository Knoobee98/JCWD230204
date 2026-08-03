const multer = require('multer');
const path = require("path");
const fs = require('fs');

let defaultPath = path.join(__dirname,'../Public');
var storage = multer.diskStorage({
    destination: async(req, file, cb) => {
        let isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`)

        if(!isDirectoryExist){
            await fs.promises.mkdir(`${defaultPath}/${file.fieldname}`, { recursive: true })
        }

        cb(null, `${defaultPath}/${file.fieldname}`)
    },
    filename: (req, file, cb) => {
        cb(null, 'PIMG-' + Date.now() + Math.round(Math.random() * 100000000) + '.' + file.mimetype.split('/')[1])
    }
})

var fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(new Error('file must be jpg or png'))
    }
}

exports.multerUpload = multer({ storage: storage, fileFilter: fileFilter })
