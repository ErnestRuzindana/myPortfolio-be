import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './src/postImages');
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});


const upload = multer({storage: storage, limits: {fieldSize: 25*1024*1024}})


export default upload;

// .fields([
//     {
//       name: "postImage", 
//       maxCount: 1
//     },
  
//     {
//       name: "headerImage", 
//       maxCount: 1
//     }
//   ])