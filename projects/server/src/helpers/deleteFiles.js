const fs = require('fs')

const deleteFiles = (files) => {
    files.profilePict.forEach((value) => {
        files.unlink(value.path, function(err){
            try {
                if(err) throw err
            } catch (error) {
                console.log(error)
            }
        })
    })
}

module.exports = deleteFiles