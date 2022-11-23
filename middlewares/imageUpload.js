const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, call) => {
    call(null, `./assets/images`);
  },
  filename: (req, file, call) => {
    call(null, "img" + Date.now() + ".jpg");
  },
});

const fileFilter = (req, file, call) => {
  if (
    // file.mimetype.startsWith("image")
    path.extname(file.originalname) === ".jpeg" ||
    path.extname(file.originalname) === ".JPEG" ||
    path.extname(file.originalname) === ".JPG" ||
    path.extname(file.originalname) === ".jpg" ||
    path.extname(file.originalname) === ".PNG" ||
    path.extname(file.originalname) === ".png"
  ) {
    call(null, true);
  } else {
    call(new Error("wrong image format"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).single("img");

module.exports = upload;
