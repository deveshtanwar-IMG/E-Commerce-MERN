const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, files, cb) => {
        cb(null, files.fieldname + '_' + Date.now() + '_' + files.originalname)
    }
})

const upload = multer({ storage: storage});

module.exports = upload;