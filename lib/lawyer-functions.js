"use strict";
const functions = require("firebase-functions");
const userServiceFunction = require("./user-service");
exports.deleteLawyer = functions.https.onCall(async (request, response) => {
    try {
        console.log("delete lawyer functions : " + request.lawyerId);
        await userServiceFunction.deleteLawyer(request.lawyerId);
    }
    catch (e) {
        throw e;
    }
});
//# sourceMappingURL=lawyer-functions.js.map