
const multer = require('multer')
const path = require('path');
const {v4} = require('uuid')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      cb(null, Date.now() + v4() + extname); // Use current timestamp and original file extension
    }
  });
  
exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed.'));
      }
    }
  }).single('image');
  