import rootPath from "app-root-path"
import fs from "fs"
import _ from "lodash"
import {
    Consent
} from "../schemas/consentSchema.js"
//import { consentsRouter } from "../Routers/consent.js";

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

async function createConsents(fileConsents) {
    // Here we have to get all the consent from DB check their title, version and text and if different then create a new consent in the DB.
    // else ignore that item
    console.log("Coming here");
    try {
        const dbConsents = await readDBConsents();
        console.log("DB consents:", dbConsents);
        const consentsToUpdate = matchConsents(fileConsents, dbConsents);
        if (consentsToUpdate && consentsToUpdate.length > 0) {
            updateConsentsInDB(consentsToUpdate);
        }


    } catch (err) {
        console.log(err);
    }
}

function matchConsents(fileConsents, dbConsents) {

    dbConsents.forEach((value, index) => {
        dbConsents[index] = _.omit(value, ["_id"]);
    });

    var updateableConsents = [];
    // 1.) get the category if present, if not then stright away add that to db with file consents object
    // 2.) if category matched then check the contents, if contents are exactly the same then ignore.
    // 3.) if category matched then check the contents, if contents not same then verify that fileconsents is exactly one version higher than the dbConsent.

    fileConsents.forEach((fileConsentElement, fileConsentIndex) => {
        const matchedCategoryConsent = dbConsents.find((dbConsentElement, dbConsentIndex) => {
            return (fileConsentElement.category === dbConsentElement.category);
        });
        // 1.) get the category if not found then add that to db, this means consents file has some new consent
        if (_.isEqual(matchedCategoryConsent, undefined)) {
            updateableConsents.push(fileConsentElement);
            return;
        }
        // 2.) if category matched then check the contents, if contents are exactly the same then ignore.
        if (_.isEqual(matchedCategoryConsent, fileConsentElement)) {
            return;
        }

        // 3.) consent category matched but contents are not the same, now verify that version is just one bigger for file consent.
        if (_.isEqual(fileConsentElement.version, matchedCategoryConsent.version + 1)) {
            updateableConsents.push(fileConsentElement);
            return;
        }

        console.log(`Version number for ${fileConsentElement.category} consent is not correct`);
        console.log("Existing...");
        process.exit(1);
    });
    console.log("Updateable consents are :", updateableConsents);
    return updateableConsents;
}


const readDBConsents = async function fetchDBConsents() {

    return new Promise((resolve, reject) => {
        Consent.aggregate(
            [{
                $sort: {
                    version: -1
                }
            }, {
                $group: {
                    _id: "$category",
                    defaultStatus: {
                        $first: "$defaultStatus"
                    },
                    readOnly: {
                        $first: "$readOnly"
                    },
                    category: {
                        $first: "$category"
                    },
                    title: {
                        $first: "$title"
                    },
                    text: {
                        $first: "$text"
                    },
                    version: {
                        $max: "$version"
                    },
                    age: {
                        $first: "$age"
                    }
                }
            }],
            function (err, results) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
    })
}

async function updateConsentsInDB(updateableConsents) {

    updateableConsents.forEach(async (con) => {
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
    loadConsents,
    readDBConsents
}