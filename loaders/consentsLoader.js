import rootPath from "app-root-path"
import fs from "fs"

import {
    Consent
} from "../schemas/consentSchema.js"
import {
    consentsRouter
} from "../Routers/consent.js";

const fileName = process.env.CONSENTS_DEFINATION_FILE;
if (!fileName) {
    console.log("No consents file env var exists");
    process.exit(1);
}

const loadConsents = async function loadConsentsFromFile() {
    console.log("Load consents ------");
    const consentArrayFromFile = await readFile();
    if (!consentArrayFromFile || consentArrayFromFile.length == 0) {
        console.log("Consents null");
    }
    await createConsents(consentArrayFromFile);
}

function readFile() {

    console.log("Root path:", rootPath.path);
    return new Promise((resolve, reject) => {

        fs.readFile(rootPath.path + "/consents.json", (err, data) => {
            if (err) {
                console.log("Error is file reading. Error: ", err);
                process.exit(1);
                return;
            }
            const JSONData = JSON.parse(data.toString());
            const array = Array.from(JSONData);
            if (!array || array.length == 0) {
                console.log("Pared array from Consents file is null or has no elemets....");
                process.exit(1);
                return
            }
            resolve(array);
        });
    });
}

async function createConsents(consentsCollection) {
    // Here we have to get all the consent from DB check their title, version and text and if different then create a new consent in the DB.
    // else ignore that item

    consentsCollection.forEach(async (con) => {
        let consent = new Consent(con);
        try {
            await consent.validate();
        } catch (err) {
            console.log(err);
            process.exit(1);
        }

        const result = await consent.save((err, doc) => {
            if (err) {
                console.log("Failed to save consent in DB.   Error:  ", err);
                console.log("EXISTING......");
                process.exit(1);
            }
            console.log(`${ doc.category } consent is saved`);
        });
    });
}

export {
    loadConsents
}