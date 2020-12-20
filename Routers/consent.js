const express = require("express");
const router = express.Router();

const {
    mongoose,
} = require("../modules/dbConnectivity")

const consentSchema = new mongoose.Schema({
    category: String,
    version: Number,
    text: String,
    age: Number,
    defaultStatus: Boolean,
    readOnly: Boolean
});

router.get("/", async (req, res) => {

    const Consent = mongoose.model("Consents", consentSchema);
    try {
        console.log("Calling the fetch...");
        const result = await Consent.find();
        res.status(200).send(result);

    } catch (error) {
        console.log("Failed to fetch...");
        res.status(400).send(new Error(error.errors.message));
    }
});

module.exports = router;