const dotenv = require("dotenv");
dotenv.config();
// // Above two llines should be the first lines on this file
// //////////////////////////////////////////////////////////
const {
    connectToDB,
} = require("./modules/dbConnectivity")

const loadConsents = require("./loaders/consentsLoader");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

console.log("Consents defination file:", process.env.CONSENTS_DEFINATION_FILE);
console.log("Directory name:", __dirname);
console.log("File name:", __filename);


loadConsents();
// fs.access(process.env.CONSENTS_DEFINATION_FILE, fs.constants.R_OK, (err) => {
//     if (err) {
//         console.log("File is not readable");
//         return
//     }
//     console.log("File is readable");
// });

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