import express from "express"

import joi from "joi";

const router = express.Router();

const schema = joi.object({
    name: joi.string().required().min(3).max(100),
    email: joi.string().required().email(),
    dob: joi.date().required()
})

router.post("/", async (req, res) => {

    console.log("Users Router");
    const userBody = req.body;

    const validationResult = schema.validate(userBody);
    if (validationResult.error) {
        console.log("Joi validation error");
        res.status(404).send(validationResult.error.message);
        return;
    }
    console.log("User body is :", JSON.stringify(userBody));
    res.send(userBody);
});
export {
    router as usersRouter
}