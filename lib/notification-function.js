"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startVideoCallNotification = exports.sendNotification = exports.rescheduleTimeslotNotification = exports.orderedTimeslotNotification = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const user_service_1 = require("./user-service");
exports.notificationStartAppointment = functions.https.onCall(async (request, response) => {
    console.log("Start appointment notification send");
    // let lawyerName = request.lawyerName;
    // let roomName = request.roomName;
    // let agoraToken = request.token;
    const { lawyerName, roomName, token, timeSlotId } = request;
    let userId = request.userId;
    let userToken = await (0, user_service_1.getUserTokenById)(userId); //await userService.getUserTokenById(userId);
    console.log("token user : " + userToken);
    await startVideoCallNotification(roomName, lawyerName, token, userId, timeSlotId);
    // await sendNotification(
    //   userToken,
    //   `Hi. ${lawyerName} has started the consultation session`,
    //   "Please join the room, to start the consultation session"
    // );
});
async function orderedTimeslotNotification(lawyerId) {
    try {
        let lawyerUser = await (0, user_service_1.getUserByLawyerId)(lawyerId);
        await sendNotification(lawyerUser.token, "Timeslot Ordered!", "one of your timeslots has been booked");
    }
    catch (error) { }
}
exports.orderedTimeslotNotification = orderedTimeslotNotification;
/**
 * send notification to lawyer, when timeslot is reschedule
 * @param lawyerId the lawyer id
 */
async function rescheduleTimeslotNotification(lawyerId) {
    try {
        let lawyerUser = await (0, user_service_1.getUserByLawyerId)(lawyerId);
        await sendNotification(lawyerUser.token, "Reschedule Appointment", "one of your timeslots has been rescheduled");
    }
    catch (error) {
        console.log(error);
    }
}
exports.rescheduleTimeslotNotification = rescheduleTimeslotNotification;
/**
sending the notification
 * @param  {string} token user token you wanto send the notification
 * @param  {string} title notification title
 * @param  {string} message notification message to send
 */
async function sendNotification(token, title, message) {
    try {
        const payload = {
            notification: {
                title: title,
                body: message,
            },
            data: {
                personSent: "testing",
            },
        };
        let response = await admin.messaging().sendToDevice(token, payload);
        console.log("Successfully send notification: ", response);
    }
    catch (error) {
        console.log("Error send notification :", error);
    }
}
exports.sendNotification = sendNotification;
/**
send video call notification to user
 * @param  {string} roomName
 * @param  {string} fromName
 * @param  {string} agoraToken agora.io token room
 * @param  {string} userId
 * @param  {string} timeSlotId
 */
async function startVideoCallNotification(roomName, fromName, agoraToken, userId, timeSlotId) {
    try {
        let title = `Incomming call from ${fromName}`;
        let body = "message";
        const payload = {
            notification: {
                title: title,
                body: body,
            },
            data: {
                personSent: fromName,
                type: "call",
                roomName: roomName,
                fromName: fromName,
                token: agoraToken,
                timeSlotId: timeSlotId,
            },
        };
        let userToken = await (0, user_service_1.getUserTokenById)(userId);
        console.log("user token : " + userToken);
        console.log("payload : " + JSON.stringify(payload));
        admin
            .messaging()
            .sendToDevice(userToken, payload)
            .then(function (response) {
            console.log("Successfully send notification: ", response);
        })
            .catch(function (error) {
            console.log("Error send notification :", error);
        });
    }
    catch (error) { }
}
exports.startVideoCallNotification = startVideoCallNotification;
//# sourceMappingURL=notification-function.js.map