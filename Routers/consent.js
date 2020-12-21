const express = require("express");
const router = express.Router();

const {
    mongoose,
} = require("../modules/dbConnectivity")

const consentSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    version: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    text: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 5000
    },
    age: {
        type: Number,
        required: true,
    },
    defaultStatus: {
        type: Boolean,
        default: true
    }, // true: Accepted, false: Revoked
    readOnly: {
        type: Boolean,
        default: false
    }
});
const Consent = mongoose.model("Consents", consentSchema);

router.get("/", async (req, res) => {

    try {
        console.log("Calling the fetch...");
        const result = await Consent.find();
        res.status(200).send(result);

    } catch (error) {
        console.log("Failed to fetch...");
        res.status(400).send(new Error(error.errors.message));
    }
});

router.get("/:category", async (req, res) => {
    try {
        const category = req.params.category;
        console.log("Category to fetch:", category);
        const fetchedConsent = Consent.find({
                category: category
            })
            .sort({
                version: -1
            })
            .limit(1);
    } catch (error) {
        console.log(error);

    }
});

router.post("/", async (req, res) => {
    console.log("Post request");
    if (req.body == null) {
        res.status(400).send("No consent found to be created...");
        return;
    }
    console.log(`Post request body: ${JSON.stringify(req.body) }`);

    const consentBody = req.body;
    var existingConsent = null;
    try {
        existingConsent = await findHighestVersionConsent(consentBody.category);
    } catch (err) {
        console.log(`No existing consent with category: ${consentBody.category} found. \n Error: ${err}`);
    }

    const newConsent = new Consent();
    if (existingConsent == null) {
        // create a new consent with this category
        newConsent.version = 1;
        newConsent.category = existingConsent.category;

        newConsent.age = req.body.age;
        newConsent.text = req.body.text;
        newConsent.defaultStatus = req.body.defaultStatus;
    } else {
        // create a new version of the consent

        newConsent.version = existingConsent.version + 1;
        newConsent.category = existingConsent.category;

        newConsent.age = req.body.age;
        newConsent.text = req.body.text;
        newConsent.defaultStatus = req.body.defaultStatus;
    }

    newConsent.save(function (err, doc) {
        if (err) {
            console.log("Error : ", err);
            res.status(500).send(err);
            return
        }
        console.log("Result : ", doc);
        res.send(doc);
    });
});

function findHighestVersionConsent(category) {

    return new Promise((resolve, reject) => {
        Consent.find({
                category: category
            }).sort({
                version: -1
            })
            .limit(1)
            .then(consents => {
                // returns Array for found documents, we are returing the first one. Actually array should contain only 1 item
                (consents != null && consents.length > 0) ? resolve(consents[0]): reject(new Error("No consent found"));
            }).catch(error => {
                reject(error);
            });
    });
}

module.exports = router;