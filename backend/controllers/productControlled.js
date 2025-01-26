import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';

// Funksiya: Mahsulotlarni qo'shish
const addProducts = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Fayllarni olish
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images = [image1, image2, image3, image4].filter(image => image !== undefined);
        console.log(images);

        // Cloudinaryga rasmni yuklash
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                } catch (uploadError) {
                    console.error("Image upload failed: ", uploadError);
                    throw new Error("Image upload failed");
                }
            })
        );

        // Mahsulot ma'lumotlarini tayyorlash
        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            sizes: JSON.parse(sizes), // Sizni tekshirish uchun
            bestseller: bestseller === 'true' ? true : false,
            image: imagesUrl,
            date: Date.now()
        };

        // Mahsulotni saqlash
        const product = new productModel(productData);
        await product.save(); // Saqlashni qo'shish
        res.json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

// Funksiya: Mahsulotlar ro'yxatini olish
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json({ success: true, message: "Products fetched successfully", products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

// Funksiya: Mahsulotni o'chirish
const removeProducts = async (req, res) => {
    try {
        // ID ni valid qilish
        if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
            return res.json({ success: false, message: "Invalid product ID" });
        }

        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

// Funksiya: Bitta mahsulotni olish
const singleProducts = async (req, res) => {
    try {
        const { productId } = req.body;

        // ID ni valid qilish
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ success: false, message: "Invalid product ID" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product fetched successfully", product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

export { addProducts, listProducts, removeProducts, singleProducts };

// import { v2 as cloudinary } from 'cloudinary';
// import productModel from '../models/productModel.js';

// // function for addProducts products
// const addProducts = async (req, res) => {
//     try {
//         const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
//         const image1 = req.files.image1 && req.files.image1[0];
//         const image2 = req.files.image2 && req.files.image2[0];
//         const image3 = req.files.image3 && req.files.image3[0];
//         const image4 = req.files.image4 && req.files.image4[0];
//         const images = [image1, image2, image3, image4].filter(image => image !== undefined);
//         let imagesUrl = await Promise.all(
//             images.map(async (item) => {
//                 let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
//                 return result.secure_url;
//             })
//         )
//         const productDate = {
//             name,
//             description,
//             category,
//             subCategory,
//             price: Number(price),
//             sizes: JSON.parse(sizes),
//             bestseller: bestseller === 'true' ? true : false,
//             image: imagesUrl,
//             date: Date.now()
//         }
//         console.log(productDate);
//         const product = new productModel(productDate);
//         res.json({ success: true, message: "Product added successfully" })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Something went wrong" })
//     }
// }

// // function for list products
// const listProducts = async (req, res) => {
//     try {
//         const products = await productModel.find();
//         res.json({ success: true, message: "Products fetched successfully", products })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Something went wrong" })
//     }
// }
// // function for remove products
// const removeProducts = async (req, res) => {
//     try {
//         await productModel.findByIdAndDelete(req.body.id);
//         res.json({ success: true, message: "Product removed successfully" })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Something went wrong" })
//     }
// }
// // function for single products
// const singleProducts = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const product = await productModel.findById(productId);
//         res.json({ success: true, message: "Product fetched successfully", product })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Something went wrong" })
//     }

// }
// export { addProducts, listProducts, removeProducts, singleProducts }