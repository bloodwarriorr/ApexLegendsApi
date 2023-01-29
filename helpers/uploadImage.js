const multer = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NANE, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });


const uploadImage=async(req, res, next)=>{
const streamUpload = (request) => {
    return new Promise((resolve, reject) => {
        
        let stream = cloudinary.uploader.upload_stream({ public_id:req.body.nickname},
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        
      streamifier.createReadStream(request.file.buffer).pipe(stream);
    });
};

async function upload(req) {
    let result = await streamUpload(req);
    req.imageUrl=result.secure_url;
    next();
}
await upload(req);

}
module.exports=uploadImage