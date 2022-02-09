const cloudinary = require("../Domain/cloudinary");

async function upload(req, res, next) {
  if (req.files) {
    try {
      if (req.files.image2) {
        req.image2 = await cloudinary.uploader.upload(
          req.files.image2.tempFilePath
        );
      }

      if (req.files.image4) {
        req.image4 = await cloudinary.uploader.upload(
          req.files.image4.tempFilePath
        );
      }

      if (req.files.image1) {
        req.image1 = await cloudinary.uploader.upload(
          req.files.image1.tempFilePath
        );
      }

      if (req.files.image3) {
        req.image3 = await cloudinary.uploader.upload(
          req.files.image3.tempFilePath
        );
      }
    } catch (er) {
      return res.send(er);
    }
  }
  next();
}

module.exports = { upload };
