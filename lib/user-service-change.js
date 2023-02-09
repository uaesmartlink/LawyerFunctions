"use strict";
const admin = require("firebase-admin");
const db = admin.firestore();
async function getUserTokenById(userId) {
    try {
        let user = await db.collection("Users").doc(userId).get();
        let userToken = user.data().token;
        if (!userToken)
            return "";
        return userToken;
    }
    catch (error) {
        throw error;
    }
}
async function getUserByLawyerId(lawyerId) {
    try {
        let lawyer = await db
            .collection("Users")
            .where("lawyerId", "==", lawyerId)
            .get();
        console.log("🚀 ~ file: user-service.js ~ line 22 ~ getUserByLawyerId ~ user by lawyer id", lawyer);
        return lawyer.docs[0];
    }
    catch (error) {
        throw error;
    }
}
async function deleteUserInDb(userId) {
    try {
        await db.collection("Users").doc(userId).delete();
        console.log("success delete user in Db");
    }
    catch (error) {
        console.log("fail delete user id Db");
        throw error;
    }
}
async function deleteUserInAuth(userId) {
    try {
        admin.auth().deleteUser(userId);
        console.log("success delete user in auth");
    }
    catch (error) {
        console.log("fail delete user in auth");
        throw error;
    }
}
async function deleteLawyer(lawyerId) {
    try {
        let user = await getUserByLawyerId(lawyerId);
        console.log("🚀 ~ file: user-service.js ~ line 50 ~ deleteLawyer ~ user", user);
        await db.collection("Lawyers").doc(lawyerId).delete();
        console.log("🚀 ~ file: user-service.js ~ line 50 ~ deleteLawyer ~ user", user);
        if (user) {
            await deleteUser(user.id);
            console.log("success delete user");
        }
        else {
            console.log("User null " + user);
        }
        console.log("success delete lawyer");
    }
    catch (error) {
        console.log("🚀 ~ file: user-service.js ~ line 67 ~ deleteLawyer ~ error", error);
        console.log("success delete lawyer");
        throw error;
    }
}
async function deleteUser(userId) {
    try {
        await deleteUserInAuth(userId);
        await deleteUserInDb(userId);
    }
    catch (error) {
        console.log("fail delete user");
        throw error;
    }
}
module.exports.getUserTokenById = getUserTokenById;
module.exports.getUserByLawyerId = getUserByLawyerId;
module.exports.deleteLawyer = deleteLawyer;
module.exports.deleteUser = deleteUser;
//# sourceMappingURL=user-service-change.js.map