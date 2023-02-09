import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { getUserByLawyerId, getUserTokenById } from "./user-service";

exports.notificationStartAppointment = functions.https.onCall(
  async (request, response) => {
    console.log("Start appointment notification send");
    // let lawyerName = request.lawyerName;
    // let roomName = request.roomName;
    // let agoraToken = request.token;
    const { lawyerName, roomName, token, timeSlotId } = request;
    let userId = request.userId;
    let userToken = await getUserTokenById(userId); //await userService.getUserTokenById(userId);
    console.log("token user : " + userToken);
    await startVideoCallNotification(
      roomName,
      lawyerName,
      token,
      userId,
      timeSlotId
    );
    // await sendNotification(
    //   userToken,
    //   `Hi. ${lawyerName} has started the consultation session`,
    //   "Please join the room, to start the consultation session"
    // );
  }
);

export async function orderedTimeslotNotification(lawyerId: string) {
  try {
    let lawyerUser = await getUserByLawyerId(lawyerId);
    await sendNotification(
      lawyerUser.token,
      "Timeslot Ordered!",
      "one of your timeslots has been booked"
    );
  } catch (error) {}
}

/**
 * send notification to lawyer, when timeslot is reschedule
 * @param lawyerId the lawyer id
 */
export async function rescheduleTimeslotNotification(lawyerId: string) {
  try {
    let lawyerUser = await getUserByLawyerId(lawyerId);
    await sendNotification(
      lawyerUser.token,
      "Reschedule Appointment",
      "one of your timeslots has been rescheduled"
    );
  } catch (error) {
    console.log(error);
  }
}
/**
sending the notification
 * @param  {string} token user token you wanto send the notification
 * @param  {string} title notification title
 * @param  {string} message notification message to send
 */
export async function sendNotification(
  token: string,
  title: string,
  message: string
) {
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
  } catch (error) {
    console.log("Error send notification :", error);
  }
}
/**
send video call notification to user
 * @param  {string} roomName
 * @param  {string} fromName
 * @param  {string} agoraToken agora.io token room
 * @param  {string} userId
 * @param  {string} timeSlotId
 */
export async function startVideoCallNotification(
  roomName: string,
  fromName: string,
  agoraToken: string,
  userId: string,
  timeSlotId: string
) {
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

    let userToken = await getUserTokenById(userId);
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
  } catch (error) {}
}
