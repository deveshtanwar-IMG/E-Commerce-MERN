const multer = require('multer');

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, files, cb) => {
        cb(null, files.fieldname + '_' + Date.now() + '_' + files.originalname)
    }
})

module.exports = multer({
    storage: storage,
}).single('image');