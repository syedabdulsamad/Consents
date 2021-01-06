import express from "express"

import joi from "joi";

const router = express.Router();


const schema = joi.object({
    name: joi.string().required().min(3).max(100),
    email: joi.string().required().email(),
    DOB: joi.date().required()
})

router.post("/", async (req, res) => {

    const userBody = req.body;
    const validationResult = schema.validate(userBody);
    if (validationResult.error) {
        res.status(400).send(validationResult.error.message);
        return;
    }

    const DOB = new Date(userBody.DOB);
    if (validateDate(DOB) == false) {
        res.status(400).send("DOB should be in format YYYY-MM-DD and must be > 18 years and < 100 years");
        return;
    }

    console.log("User body is :", JSON.stringify(userBody));
    res.send(DOB);
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