import prisma from '../db/prisma.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// GET: Ambil semua produk
export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ status: 'success', data: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// GET: Ambil satu produk
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });
        if (!product) return res.status(404).json({ status: 'fail', message: "Produk gak ada bestie" });
        res.json({ status: 'success', data: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: "Server error" });
    }
};

// POST: Tambah produk + Upload Cloudinary
export const createProduct = async (req, res) => {
    // === DEBUGGING AREA ===
    console.log("🔥 [DEBUG] Request Body (Text):", req.body);
    console.log("🔥 [DEBUG] Request Files:", req.files);
    // ======================

    const { slug, name, price, description } = req.body;

    // Pastikan key-nya 'image', bukan 'imageFile' atau 'gambar'
    const imageFile = req.files?.['image']?.[0];
    const videoFile = req.files?.['video']?.[0];

    // Cek mana yang kosong
    if (!slug) console.log("❌ Slug kosong");
    if (!name) console.log("❌ Name kosong");
    if (!price) console.log("❌ Price kosong");
    if (!imageFile) console.log("❌ File Image gak ketemu/salah key");

    if (!slug || !name || !price || !imageFile) {
        return res.status(400).json({ status: 'fail', message: "Data wajib diisi (termasuk gambar)!" });
    }

    try {
        // 1. Upload Gambar
        console.log("🚀 Sedang upload gambar ke Cloudinary...");
        const imageUpload = await uploadToCloudinary(imageFile.buffer, 'umkm_products', 'image');
        const imageUrl = imageUpload.secure_url;
        console.log("✅ Gambar uploaded:", imageUrl);

        // 2. Upload Video (Opsional)
        let videoUrl = "";
        if (videoFile) {
            console.log("🚀 Sedang upload video...");
            const videoUpload = await uploadToCloudinary(videoFile.buffer, 'umkm_products', 'video');
            videoUrl = videoUpload.secure_url;
        }

        // 3. Simpan DB
        const newProduct = await prisma.product.create({
            data: {
                slug,
                name,
                price,
                description: description || "",
                image_url: imageUrl,
                video_url: videoUrl
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Produk + File berhasil diupload!',
            data: newProduct
        });

    } catch (error) {
        console.error("Upload Error:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ status: 'fail', message: "Slug udah kepake!" });
        }
        res.status(500).json({ status: 'error', message: error.message || "Gagal upload file" });
    }
};

// PATCH: Update produk
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { slug, name, price, description } = req.body;

    const imageFile = req.files?.['image']?.[0];
    const videoFile = req.files?.['video']?.[0];

    try {
        const oldProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        if (!oldProduct) return res.status(404).json({ message: "Produk not found" });

        let finalImageUrl = oldProduct.image_url;
        let finalVideoUrl = oldProduct.video_url;

        if (imageFile) {
            const uploadRes = await uploadToCloudinary(imageFile.buffer, 'umkm_products', 'image');
            finalImageUrl = uploadRes.secure_url;
        }

        if (videoFile) {
            const uploadRes = await uploadToCloudinary(videoFile.buffer, 'umkm_products', 'video');
            finalVideoUrl = uploadRes.secure_url;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                slug, name, price, description,
                image_url: finalImageUrl,
                video_url: finalVideoUrl
            }
        });

        res.json({ status: 'success', message: 'Produk updated!', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE: Hapus produk
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ status: 'success', message: 'Produk deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};