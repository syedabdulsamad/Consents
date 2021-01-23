import express from "express"
const router = express.Router();
import {
    auth
} from "../middleware/auth.js"
import {
    readAllConsents,
    readSingleConsent
} from "../database_operations/consents.js"

import {
    from
} from "rxjs"

import {
    map,
    toArray
} from "rxjs/operators/index.js"
import _ from "lodash"

const omitableProperties = ["_id", "defaultStatus", "__v"];

router.get("/", auth, async (req, res) => {

    console.log("request token data: ", req.body.token_data);

    try {
        console.log("Calling the fetch all consents...");

        const consentsCollection = await readAllConsents();
        from(consentsCollection).pipe(
                map(consent =>
                    _.omit(consent, omitableProperties)
                ),
                toArray())
            .subscribe(consents => res.status(200).send(consents));
    } catch (error) {
        console.log("Failed to fetch...");
        res.status(400).send(new Error(error.errors.message));
    }
});

router.get("/:category", auth, async (req, res) => {
    try {
        const category = req.params.category;
        console.log("Calling to fetch consent: ", category);

        const result = await readSingleConsent(category);
        if (!result) {
            res.status(400).send(`Consent with category : ${category} not found`);
            return
        }
        // convert document to Javascript object
        const fetchedConsent = result.toObject();
        res.send(_.omit(fetchedConsent, omitableProperties));
    } catch (error) {
        console.log(error);
        res.status(400).send(error.errors.message);
        return
    }
});

export {
    router as consentsRouter
}