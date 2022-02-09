const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
