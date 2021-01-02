import express from "express"
const router = express.Router();

import {
    mongoose
} from "../modules/dbConnectivity.js"
import {
    readDBConsents
} from "../loaders/consentsLoader.js"
import {
    Consent
} from "../schemas/consentSchema.js"

import {
    pipe,
    from
} from "rxjs"

import {
    map,
    toArray
} from "rxjs/operators/index.js"
import _ from "lodash"



router.get("/", async (req, res) => {

    try {
        console.log("Calling the fetch...");

        const consentsCollection = await readDBConsents();
        from(consentsCollection).pipe(
                map(consent =>
                    _.omit(consent, ["_id", "readOnly", "defaultStatus"])
                ),
                toArray())
            .subscribe(consents => res.status(200).send(consents));
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

export {
    router as consentsRouter
}