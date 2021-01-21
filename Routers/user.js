import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import joi from "joi"
import {
    async,
    from
} from "rxjs";

import {
    User
} from "../schemas/userSchema.js"
import {
    mongoose
} from "../database_operations/dbConnectivity.js";


const router = express.Router();

const complexityOptions = {
    min: 8,
    max: 40,
    upperCase: 1,
    numeric: 1,
    symbol: 1
}

const jwt_secret = process.env.JWT_SECRET_KEY

const userCreationSchema = joi.object({
    name: joi.string().required().min(3).max(100),
    email: joi.string().required().email(),
    password: joi.string().min(8).max(40),
    DOB: joi.date().required()
})

router.post("/login", async (req, res) => {

    const schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required()
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.message);
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("Hashed: ", hashedPassword);
    const user = await User.findOne({
        email: req.body.email,
    });
    if (!user) {
        res.status(400).send("Invalid username or password");
        return;
    }

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
        res.status(400).send("Invalid username or password");
        return;
    }
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // token expires in 15 minutes
        _id: user._id
    }, jwt_secret);

    res.send(token);
    return;
});

// router.post("/login/token", async (req, res) => {

//     jwt.verify(req.body.token, jwt_secret, (error, decoded) => {
//         if (error) {

//             res.send(error).status(401);
//             return;
//         }

//         User.findById(decoded._id, (err, doc) => {
//             if (err != null) {
//                 res.status(401).send(err);
//             }
//             console.log("User: ", doc);
//             res.send("verified");
//         });

//     });
// })


router.post("/", async (req, res) => {

    const userBody = req.body;
    const validationResult = userCreationSchema.validate(userBody);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.message);
        return;
    }

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
    const user = new User({
        name: userBody.name,
        email: userBody.email,
        password: hashedPassword,
        DOB: userBody.DOB
    });
    try {
        await user.validate();
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong. try again latter.");
    }
    user.save((error, doc) => {
        if (error) {
            console.log(`Error when creating user ${error}`);
            res.status(400).send(error);
            return;
        } else {
            console.log(`User created:  ${doc}`);
            const token = jwt.sign({
                _id: doc._id
            }, jwt_secret);

            res.status(200).send(token)
        }

    });
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