const express = require("express");
const router = express.Router();
const {
    mongoose,
} = require("../modules/dbConnectivity")

router.get("/", (req, res) => {
    console.log("Coming here");
    res.send("Consent Get working nicely now ");
});

module.exports = router;