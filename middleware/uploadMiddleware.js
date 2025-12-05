import multer from 'multer';

const storage = multer.memoryStorage();

// Filter biar cuma bisa upload gambar & video
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya boleh upload gambar atau video woy!'), false);
  }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

export default upload;