import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartControlled.js';
import authUser from './../middleware/auth.js';

const cartRouter = express.Router();
cartRouter.get('/get', authUser, getUserCart);
cartRouter.post('/add', authUser, addToCart);
cartRouter.put('/update', authUser, updateCart);
export default cartRouter;