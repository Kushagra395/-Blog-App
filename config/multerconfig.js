 
  
//   const upload = multer({ storage: storage })
  
//   module.exports = upload

// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");
// const fs = require("fs");

// const uploadPath = path.join(__dirname, "public/images/uploads");

// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     crypto.randomBytes(12, (err, buffer) => {
//       if (err) return cb(err);
//       const filename = buffer.toString("hex") + path.extname(file.originalname);
//       cb(null, filename);
//     });
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
 