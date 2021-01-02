import {
    Consent
} from "../schemas/consentSchema.js"
import {
    async
} from "rxjs";

const readAllConsents = async function fetchDBConsents() {

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

const readSingleConsent = async function readSingleConsent(category) {
    if (!category || category.length <= 2) {
        return null;
    }
    try {
        const consents = await Consent.find({
            category: category
        }).sort({
            version: -1
        }).limit(1);

        if (consents && consents.length > 0) {
            return consents[0];
        }
        return null;

    } catch (err) {
        console.log("Error in finding consent category: ", category);
        return null;
    }
}


export {
    readAllConsents,
    readSingleConsent,
    updateConsentsInDB

}