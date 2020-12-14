// const express = require("express");
// const config = require("config");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/Consents", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connection successful"))
    .catch((error) => console.log(error));



const consentSchema = new mongoose.Schema({
    version: Number,
    category: {
        type: String,
        maxlength: 20
    },
    age: Number,
    text: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 1000
    },
    readonly: Boolean,
    defaultStatus: Boolean

});

const Consent = mongoose.model("Consent", consentSchema);

async function createConsent() {

    try {
        const consent = new Consent({
            version: 1,
            category: "marketing",
            text: "This is the marketing Consent",
            age: 18,
            defaultStatus: false,
            readonly: false
        });

        const result = await consent.save()
        console.log(`Saved Consent: ${result}`)
    } catch (error) {
        console.log(error.message);
    }
}

createConsent();
// const app = express();


// const PORT = process.env.PORT || 3000
// console.log(`App Env: ${app.get("env")}`);
// app.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`);

// })