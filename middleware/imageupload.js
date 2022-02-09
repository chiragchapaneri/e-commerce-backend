const multer = require("multer");
const cloudinary = require("../Domain/cloudinary");

async function uploadimage(req, res, next) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "tmp");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(file.fieldname + "-" + uniqueSuffix);
    },
  });

  const upload = multer({ storage: storage });
  console.log(req.files);
  try {
    if (req.files.image1) {
      req.image1 = await cloudinary.uploader.upload(
        req.files.image1.tempFilePath
      );
    } else {
      upload.single("image1");
      upload.single("image2");
      upload.single("image3");
      upload.single("image4");
      upload.single("image5");
    }

    req.files.image
      ? (req.image = await cloudinary.uploader.upload(
          req.files.image.tempFilePath
        ))
      : "";
    req.files.image2
      ? (req.image2 = await cloudinary.uploader.upload(
          req.files.image2.tempFilePath
        ))
      : "";

    req.files.image1
      ? (req.image1 = await cloudinary.uploader.upload(
          req.files.image1.tempFilePath
        ))
      : "";

    req.files.image3
      ? (req.image3 = await cloudinary.uploader.upload(
          req.files.image3.tempFilePath
        ))
      : "";

    req.files.image4
      ? (req.image4 = await cloudinary.uploader.upload(
          req.files.image4.tempFilePath
        ))
      : "";

    req.files.image5
      ? (req.image5 = await cloudinary.uploader.upload(
          req.files.image5.tempFilePath
        ))
      : "";
  } catch (er) {
    console.log(er);
  }

  async function uploadimage(req, res) {
    req.files.image
      ? (req.image = await cloudinary.uploader.upload(
          req.files.image.tempFilePath
        ))
      : "";
    req.files.image2
      ? (req.image2 = await cloudinary.uploader.upload(
          req.files.image2.tempFilePath
        ))
      : "";

    req.files.image1
      ? (req.image1 = await cloudinary.uploader.upload(
          req.files.image1.tempFilePath
        ))
      : "";

    req.files.image3
      ? (req.image3 = await cloudinary.uploader.upload(
          req.files.image3.tempFilePath
        ))
      : "";

    req.files.image4
      ? (req.image4 = await cloudinary.uploader.upload(
          req.files.image4.tempFilePath
        ))
      : "";

    req.files.image5
      ? (req.image5 = await cloudinary.uploader.upload(
          req.files.image5.tempFilePath
        ))
      : "";
  }
}

async function uploadimages(req, res, data) {
  // if (req.files.image1) {
  //   req.image1 = await cloudinary.uploader.upload(
  //     req.files.image1.tempFilePath
  //   );
  // }
}

module.exports = { uploadimage, uploadimages };
