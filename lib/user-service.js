"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.deleteLawyer = exports.getUserByLawyerId = exports.getUserTokenById = void 0;
const collections_1 = require("./collections");
const admin = require("firebase-admin");
async function getUserTokenById(userId) {
    var _a;
    let user = await collections_1.usersCol.doc(userId).get();
    console.log("user user token: " + user.token);
    return Promise.resolve((_a = user.data()) === null || _a === void 0 ? void 0 : _a.token);
}
exports.getUserTokenById = getUserTokenById;
async function getUserByLawyerId(lawyerId) {
    var userRef = await collections_1.usersCol.where("lawyerId", "==", lawyerId).get();
    return userRef.docs[0].data();
}
exports.getUserByLawyerId = getUserByLawyerId;
async function deleteUserInDb(userId) {
    try {
        await collections_1.usersCol.doc(userId).delete();
        console.log("success delete user in Db");
    }
    catch (error) {
        console.log("fail delete user in auth");
    }
}
async function deleteUserInAuth(userId) {
    try {
        await admin.auth().deleteUser(userId);
        console.log("success delete user in auth");
    }
    catch (error) {
        console.log("error delete user");
    }
}
async function deleteLawyer(lawyerId) {
    try {
        let user = await getUserByLawyerId(lawyerId);
        await collections_1.lawyerCol.doc(lawyerId).delete();
        if (user) {
            await deleteUser(user.uid);
            console.log("success delete user");
        }
        else {
            console.log("User null " + user);
        }
        console.log("success delete lawyer");
    }
    catch (error) {
        console.log("🚀 ~ file: user-service.js ~ line 67 ~ deleteLawyer ~ error", error);
        throw error;
    }
}
exports.deleteLawyer = deleteLawyer;
async function deleteUser(userId) {
    try {
        await deleteUserInAuth(userId);
        await deleteUserInDb(userId);
    }
    catch (error) {
        console.log("failed delete user");
        throw error;
    }
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=user-service.js.map