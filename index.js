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