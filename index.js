// import dotenv from "dotenv"
// dotenv.config();
// // Above two llines should be the first lines on this file
// //////////////////////////////////////////////////////////
import {
    connectToDB,
} from "./modules/dbConnectivity.js"

import {
    loadConsents
} from "./loaders/consentsLoader.js"
import express from "express"

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

async function starters() {
    await connectDB();
    await loadConsents();
}

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

starters();

import {
    consentsRouter
} from "./Routers/consent.js"
app.use("/consents", consentsRouter);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});