import express from 'express';
import upload from '../middleware/uploadMiddleware.js'; 
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// === DEFINISI MIDDLEWARE UPLOAD ===
// Kita define dulu aturan mainnya.
// 'upload.fields' itu dipake kalo kita mau upload beberapa file dengan key/name yang beda.
// Disini kita bolehin field 'image' (wajib 1 file) dan 'video' (max 1 file).
const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'video', maxCount: 1 }
]);

// === ROUTES ===

router.get('/product', getProducts);
router.get('/product/:id', getProductById);

router.post('/product/', uploadFields, createProduct); 

router.patch('/product/:id', uploadFields, updateProduct);

// DELETE: Gak butuh upload
router.delete('/product/:id', deleteProduct);

export default router;