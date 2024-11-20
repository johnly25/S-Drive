const multer = require("multer")
const multerOpts = require("../config/multer")
const upload = multerOpts
const maxSize = 10485760;

exports.uploadFile = (req, res, next) => {
    const uploadFunction = upload.single('uploaded_file')
    uploadFunction(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('hello error instance', err)
            next(err)
        } else if (err) {
            console.log('hello unknown error instance', err)
            next(err)
        } else if (req.file.size > maxSize) {
            console.log('file too big')
            const newError = new Error("File exceeds 10 MB")
            next(newError)
        }
        else {
            next()
        }
    })
}