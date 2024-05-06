const multer = require("multer");

const fileDestination = function (req, file, cb) {
    let uploadFolder;
    if (file.fieldname === 'profileImage') {
        uploadFolder = 'profiles';
    } else if (file.fieldname === 'productImage') {
        uploadFolder = 'products';
    } else {
        uploadFolder = 'documents';
    }
    cb(null, `src/public/images/${uploadFolder}`);
};

const storage = multer.diskStorage({
    destination: fileDestination,
    filename: function(req,file,cb){
        cb(null,Date.now() + "-" + file.originalname)
    },

})

const upload = multer({storage: storage})

module.exports = upload