import userModel from "../models/useModel.js";

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userdId, itemId, size } = req.body;
        const userData = await userModel.findById(userdId);
        let cartData = await userData.cartData
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        await userData.findByIdAndUpdate(userdId, { cartData })
        res.json({ success: true, message: "Product added to cart" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// add update to user cart
const updateCart = async (req, res) => {
    try {
        const { userdId, itemId, size, quantity } = req.body;

        const userData = await userModel.findById(userdId);
        let cartData = await userData.cartData

        cartData[itemId][size] = quantity
        await userData.findByIdAndUpdate(userdId, { cartData });
        res.json({ success: true, message: "Cart updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// add user to user cart
const getUserCart = async (req, res) => {
    try {
        const { userdId } = req.body;
        const userData = await userModel.findById(userdId);
        let cartData = await userData.cartData

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
export { addToCart, updateCart, getUserCart }