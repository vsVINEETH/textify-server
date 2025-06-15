import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

// Use memory storage — file will be available in `req.file.buffer`
const storage = multer.memoryStorage()

// Only allow image files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'))
  }
}

export const uploads = multer({
    storage,
    fileFilter,
      limits: {
    fileSize: 20 * 1024 * 1024, // 5 MB limit
   },
 })
.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]);
