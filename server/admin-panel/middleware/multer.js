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

// const upload = multer({ storage: storage }).single('image'); // for single file
// const upload = multer({ storage: storage }).array('image', 5); // for multiple files

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpeg') {
            cb(null, true)
        }
        else {
            cb(null, false)
            return cb(new Error('only .png, .jpg and .jpeg format allowed!'))
        }
    },
    limits: { fileSize: 1 * 1024 * 1024 } // 1 MB file max-size
}).single('image');