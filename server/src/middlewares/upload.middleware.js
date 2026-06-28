import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpeg, png, jpg, webp) are allowed'), false)
  }
}

const createCloudinaryStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder:         `khaja/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  })

export const uploadProduct = multer({
  storage: createCloudinaryStorage('products'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const uploadAvatar = multer({
  storage: createCloudinaryStorage('avatars'),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})