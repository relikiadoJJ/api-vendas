import crypto from 'node:crypto'
import path from 'node:path'
import multer from 'fastify-multer'
import type { Options } from 'fastify-multer/lib/interfaces'
import type { FileFilterCallback } from 'multer' // <- Correto

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadFolder)
  },
  filename: (_req, file, callback) => {
    const fileHash = crypto.randomBytes(10).toString('hex')
    const filename = `${fileHash}-${file.originalname}`
    callback(null, filename)
  },
})

// Filtro de tipos de arquivos permitidos
const fileFilter: Options['fileFilter'] = (
  _req,
  file,
  callback: FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Tipo de arquivo inválido.'))
  }
}

// Limites de tamanho de arquivo
const limits: Options['limits'] = {
  fileSize: 2 * 1024 * 1024, // 2MB
}

export default {
  directory: uploadFolder,
  storage,
  fileFilter,
  limits,
}
