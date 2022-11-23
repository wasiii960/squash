const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, call) => {
    call(null, `./assets/videos`);
  },
  filename: (req, file, call) => {
    call(null, "mobileUpload" + Date.now() + ".mp4");
  },
});

const fileFilter = (req, file, call) => {
  if (path.extname(file.originalname) === ".mp4") {
    call(null, true);
  } else {
    call(new Error("wrong video format"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 200,
  },
  fileFilter: fileFilter,
}).single("video");

module.exports = upload;
