import orderModel from "../models/orderModel.js";
import userModel from "../models/useModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
// global variables
const currency = 'inr'
const deliveryCharge = 100;
// Stripe Payment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
// Placing orders using COD Mehthod
const placeOrder = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
// Placing orders using Stripe Mehthod
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        const line_items = items.map((item) => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.qty,
            }
        })
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Shipping Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        })
        const session = await stripe.checkout.sessions.create({
            succes_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        })
        res.json({ success: true, session_url: session.url });
    }

    catch (error) {
        res.json({ success: false, message: error.message });
    }
}
// veryfy stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Order Placed Successfully" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Order Placed Successfully" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing orders using Rezorpey Mehthod
const placeOrderRezorpey = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error.message });
            }
            res.json({ success: true, order });
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
const verifyRazorpay = async (req, res) => {
    try {
        const { orderId, razorpay_order_id } = req.body;
        const oderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (oderInfo.status === "paid") {
            await orderModel.findByIdAndUpdate(oderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Order Placed Successfully" });
        } else {
            res.json({ success: false, message: "Order Placed Failed" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
// All orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
// user orders data for user panel
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRezorpey, allOrders, userOrders, updateOrderStatus }