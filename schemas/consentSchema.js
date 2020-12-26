import {
    mongoose
} from "../modules/dbConnectivity.js"

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
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
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
        type: String,
        enum: ["ACCEPTED", "REJECTED"],
        default: "ACCEPTED"
    }, // true: Accepted, false: Revoked
    readOnly: {
        type: Boolean,
        default: false
    }
});
const Consent = mongoose.model("Consents", consentSchema);

export {
    Consent,
    consentSchema
};