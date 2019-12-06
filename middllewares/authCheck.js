const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
export const authCheck = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.send(401);
            } else {
                next();
            }
        });
    } else {
        res.send(401);
    }
};