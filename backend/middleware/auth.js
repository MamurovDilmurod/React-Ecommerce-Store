import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login First" });
    }
    try {
        const toke_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = toke_decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}
export default authUser;