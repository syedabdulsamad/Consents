import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import joi from "joi"

const router = express.Router();

const complexityOptions = {
    min: 8,
    max: 40,
    upperCase: 1,
    numeric: 1,
    symbol: 1
}

const schema = joi.object({
    name: joi.string().required().min(3).max(100),
    email: joi.string().required().email(),
    password: joi.string().min(8).max(40),
    DOB: joi.date().required()
})

router.post("/", async (req, res) => {

    const userBody = req.body;
    const validationResult = schema.validate(userBody);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.message);
        return;
    }

    const jwt_secret = process.env.JWT_SECRET_KEY1
    if (!jwt_secret) {
        res.status(500).send("No token key found");
        return;
    }

    const DOB = new Date(userBody.DOB);
    if (validateDate(DOB) == false) {
        res.status(400).send("DOB should be in format YYYY-MM-DD and must be > 18 years and < 100 years");
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userBody.password, salt);

    console.log("Hashed Password :", hashedPassword);
    // store this in db
    const token = jwt.sign(hashedPassword, jwt_secret);
    console.log("Token :", token);
    console.log("User body is :", JSON.stringify(userBody));
    res.send(token);
});


function validateDate(DOB) {

    const now = new Date();
    const maxAllowed = (new Date()).setUTCFullYear(now.getUTCFullYear() - 18);
    const minAllowed = (new Date()).setUTCFullYear(now.getUTCFullYear() - 100);

    const maxDOB = new Date(maxAllowed);
    const minDOB = new Date(minAllowed);

    return (DOB && DOB >= minDOB && DOB < maxDOB)
}
export {
    router as usersRouter
}