"use strict";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const userService = require("./user-service");
exports.notificationTest = functions.https.onCall(async (request, response) => {
    // console.log("Test notification");
    // let lawyerUser = await userService.getUserByLawyerId("fcsLbxAIPXIYypnszNRo");
    // let lawyerToken = await userService.getUserTokenById(lawyerUser.id);
    // await sendNotification(
    //   lawyerToken,
    //   "Timeslot Ordered!",
    //   "one of your timeslots has been booked"
    // );
    //await testNotification();
});
/** Send notification to user, when lawyer start appointment
 *
 */
exports.notificationStartAppointment = functions.https.onCall(async (request, response) => {
    // console.log("Test notification");
    // let lawyerUser = await userService.getUserByLawyerId("fcsLbxAIPXIYypnszNRo");
    // let lawyerToken = await userService.getUserTokenById(lawyerUser.id);
    console.log("Start appointment notification send aaa");
    let lawyerName = request.lawyerName;
    let userId = request.userId;
    let userToken = await userService.getUserTokenById(userId);
    console.log("token user : " + userToken);
    await sendNotification(userToken, `Hi. ${lawyerName} has started the consultation session`, "Please join the room, to start the consultation session");
});
/**
 * send notification to lawyer, when his timeslot is ordered
 * @param lawyerId the lawyer id
 */
async function orderedTimeslotNotification(lawyerId) {
    let lawyerUser = await userService.getUserByLawyerId(lawyerId);
    let lawyerToken = await userService.getUserTokenById(lawyerUser.id);
    await sendNotification(lawyerToken, "Timeslot Ordered!", "one of your timeslots has been booked");
}
/**
 * send notification to lawyer, when timeslot is reschedule
 * @param lawyerId the lawyer id
 */
async function rescheduleTimeslotNotification(lawyerId) {
    let lawyerUser = await userService.getUserByLawyerId(lawyerId);
    let lawyerToken = await userService.getUserTokenById(lawyerUser.id);
    await sendNotification(lawyerToken, "Reschedule Appointment", "one of your timeslots has been rescheduled");
}
/**
Send Notification
 * @param  {string} token
 * @param  {string} title
 * @param  {string} message
 */
async function sendNotification(token, title, message) {
    const payload = {
        notification: {
            title: title,
            body: message,
        },
        data: {
            personSent: "testing",
        },
    };
    admin
        .messaging()
        .sendToDevice(token, payload)
        .then(function (response) {
        console.log("Successfully send notification: ", response);
    })
        .catch(function (error) {
        console.log("Error send notification :", error);
    });
}
module.exports.sendNotification = sendNotification;
module.exports.orderedTimeslotNotification = orderedTimeslotNotification;
module.exports.rescheduleTimeslotNotification = rescheduleTimeslotNotification;
//# sourceMappingURL=notification-function-change.js.map