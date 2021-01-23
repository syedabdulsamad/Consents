import jwt from "jsonwebtoken"

const jwt_secret = process.env.JWT_SECRET_KEY;
export function auth(req, res, next) {
    console.log("Token in auth", req.headers.token);
    const token = req.headers.token;
    jwt.verify(token, jwt_secret, (error, decoded) => {
        if (error) {
            res.status(401).send({
                "path": req.path,
                "error": error
            });

            return;
        }
        req.body.token_data = decoded;

        console.log("AUthorisation succesful");
        next();
    });
}