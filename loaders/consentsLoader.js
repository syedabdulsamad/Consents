const rootPath = require("app-root-path");
const fs = require("fs");
const {
    isArray
} = require("util");



const fileName = process.env.CONSENTS_DEFINATION_FILE;
if (!fileName) {
    console.log("No consents file env var exists");
    process.exit(1);
}

module.exports = function loadConsents() {
    readFile();
}

function readFile() {

    console.log("Root path:", rootPath.path);
    fs.readFile(rootPath.path + "/consents.json", (err, data) => {
        if (err) {
            console.log("Error is file reading. Error: ", err);
            process.exit(1);
            return;
        }
        const JSONData = JSON.parse(data.toString());
        const array = Array.from(JSONData);
    });
}