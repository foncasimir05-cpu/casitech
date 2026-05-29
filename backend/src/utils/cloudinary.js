const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'casitech/products',
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const uploadBuffer = (buffer, mimetype) => new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { folder: 'casitech/products', transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }], resource_type: 'image' },
    (err, result) => err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id })
  ).end(buffer);
});

const deleteImage = async (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = { uploadImage, uploadBuffer, deleteImage };
