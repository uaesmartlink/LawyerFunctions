const functions = require("firebase-functions");
// const stripeFunction = require("./stripe-function");
const agoraFunction = require("./agora-functions");
const notificationFunction = require("./notification-function");
const lawyerFunction = require("./lawyer-functions");
const userFunction = require("./user-functions");
const timeSlotFunction = require("./timeslot-function");
const withdrawFunction = require("./withdraw-functions");
const paystackFunction = require("./paystack-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const { firestore } = require("firebase-admin");

exports.lawyerAdded = functions.firestore
  .document("/Lawyers/{lawyerId}")
  .onCreate((snapshot, context) => {
    snapshot.ref.update({ balance: 0 });
    return Promise.resolve();
  });

// user confirm consultation complete, give money to lawyer & create transaction
exports.confirmConsultation = functions.firestore
  .document("/Order/{orderId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (
      newValue.status == "success" &&
      previousValue.status == "payment_success"
    ) {
      //get lawyer timeslot
      let timeSlot = await db
        .collection("LawyerTimeslot")
        .doc(previousValue.timeSlotId)
        .get();

      //increase lawyer balance by order ammount
      await db
        .collection("Lawyers")
        .doc(timeSlot.data().lawyerId)
        .get()
        .then((querySnapshot) => {
          let lawyerBalance = querySnapshot.data().balance;
          let balanceNow = (lawyerBalance += previousValue.amount);
          querySnapshot.ref.update({ balance: balanceNow });
          console.log("balance now : " + balanceNow);
        });

      //get user id by lawyer
      let userId = await db
        .collection("Users")
        .where("lawyerId", "==", timeSlot.data().lawyerId)
        .get()
        .then(async (querySnapshot) => {
          let lawyerId = {};
          querySnapshot.forEach(function (doc) {
            lawyerId = doc.id;
          });
          return lawyerId;
        });

      //Create Transaction for lawyer, that user already comfirm their consultation
      await db.collection("Transaction").add({
        userId: userId,
        amount: previousValue.amount,
        status: "complete",
        type: "payment",
        timeSlot: previousValue.timeSlotId,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      });
    }
  });

// exports.purchaseTimeslot = stripeFunction.purchaseTimeslot;
// exports.refundTimeslot = stripeFunction.refundTimeslot;
exports.generateToken = agoraFunction.generateToken;
// exports.stripeWebhook = stripeFunction.stripeWebhook;
exports.notificationTest = notificationFunction.notificationTest;
exports.notificationStartAppointment =
  notificationFunction.notificationStartAppointment;
exports.deleteLawyer = lawyerFunction.deleteLawyer;
exports.deleteUser = userFunction.deleteUser;
exports.rescheduleTimeslot = timeSlotFunction.rescheduleTimeslot;
exports.withdrawRequiest = withdrawFunction.withdrawRequest;
exports.requestPaystackPaymentUrl = paystackFunction.requestPaystackPaymentUrl;
