// import dotenv from "dotenv"
// dotenv.config();
// // Above two llines should be the first lines on this file
// //////////////////////////////////////////////////////////
import {
    connectToDB,
} from "./database_operations/dbConnectivity.js"

import {
    loadConsents
} from "./loaders/consentsLoader.js"

import {
    log
} from "./middleware/logger.js"

import {
    auth
} from "./middleware/auth.js"

import {
    consentsRouter
} from "./Routers/consent.js"
import {
    usersRouter
} from "./Routers/user.js"

import express from "express"
import {
    from
} from "rxjs"

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
app.use(log);
app.use("/consents", consentsRouter);
app.use("/users", usersRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});