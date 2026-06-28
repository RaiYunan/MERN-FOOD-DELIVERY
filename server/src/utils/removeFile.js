import cloudinary from '../config/cloudinary.js'

const removeFile = async (imageUrl) => {
  if (!imageUrl) return
  if (!imageUrl.includes('cloudinary.com')) return

  try {
    const parts   = imageUrl.split('/')
    const filename = parts.at(-1).split('.')[0]
    const folder   = parts.at(-2)
    const publicId = `${folder}/${filename}`
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message)
  }
}

export default removeFile