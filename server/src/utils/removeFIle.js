import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const removeFile = (filePath) => {
  if (!filePath) return

  // filePath is stored like "/uploads/products/xyz.jpg"
  const fullPath = path.join(__dirname, '..', '..', filePath)

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete file: ${fullPath}`, err.message)
    }
  })
}

export default removeFile