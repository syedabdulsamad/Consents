const dotenv = require("dotenv");
dotenv.config();
// // Above two llines should be the first lines on this file
// //////////////////////////////////////////////////////////
const {
    connectToDB,
} = require("./modules/dbConnectivity")


const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


async function connectDB() {
    try {
        const dbHandler = await connectToDB();
        console.log("DB connection successfull...")
    } catch (error) {
        console.log(error);
        console.log("Failed to connectto DB... Exiting...")
        process.exit(1);
    }
}
connectDB();

const consentsRouter = require("./Routers/consent");
app.use("/consents", consentsRouter);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});



// const consentSchema = new mongoose.Schema({
//     version: Number,
//     category: {
//         type: String,
//         maxlength: 20
//     },
//     age: Number,
//     text: {
//         type: String,
//         required: true,
//         minlength: 20,
//         maxlength: 1000
//     },
//     readonly: Boolean,
//     defaultStatus: Boolean

// });

// const Consent = mongoose.model("Consent", consentSchema);

// async function createConsent() {

//     try {
//         const consent = new Consent({
//             version: 1,
//             category: "marketing",
//             text: "This is the marketing Consent",
//             age: 18,
//             defaultStatus: false,
//             readonly: false
//         });

//         const result = await consent.save()
//         console.log(`Saved Consent: ${result}`)
//     } catch (error) {
//         console.log(error.message);
//     }
// }

//createConsent();
// const app = express();


// const PORT = process.env.PORT || 3000
// console.log(`App Env: ${app.get("env")}`);
// app.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`);

// })